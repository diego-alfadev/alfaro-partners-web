import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadClip } from './guided-tour-motion';

class FakeVideo extends EventTarget {
  dataset: Record<string, string> = { src: '/inmuebles/media/ap-test/sample.mp4' };
  preload = 'none';
  readyState = 0;
  private source = '';
  sources: string[] = [];
  plays = 0;
  pauses = 0;
  loads = 0;
  rejectBlob = false;
  rejectNative = false;
  synchronous = false;
  get src() { return this.source; }
  set src(value: string) {
    this.source = value;
    this.sources.push(value);
    if (this.synchronous) this.deliver();
  }
  deliver() {
    if ((this.source.startsWith('blob:') && this.rejectBlob)
      || (!this.source.startsWith('blob:') && this.rejectNative)) {
      this.dispatchEvent(new Event('error'));
    } else {
      this.readyState = 2;
      this.dispatchEvent(new Event('loadeddata'));
    }
  }
  load() { this.loads++; if (!this.synchronous) queueMicrotask(() => this.deliver()); }
  async play() { this.plays++; }
  pause() { this.pauses++; }
}

async function fixture(run: (video: FakeVideo, requests: string[], revoked: string[]) => Promise<void>) {
  const fetcher = globalThis.fetch;
  const create = URL.createObjectURL;
  const revoke = URL.revokeObjectURL;
  const requests: string[] = [], revoked: string[] = [];
  globalThis.fetch = (async (source: string) => {
    requests.push(source);
    return new Response(new Blob(['synthetic media'], { type: 'video/mp4' }));
  }) as typeof fetch;
  URL.createObjectURL = () => 'blob:https://example.test/clip';
  URL.revokeObjectURL = (url) => { revoked.push(url); };
  try { await run(new FakeVideo(), requests, revoked); }
  finally { globalThis.fetch = fetcher; URL.createObjectURL = create; URL.revokeObjectURL = revoke; }
}

// One public loader path; media, fetch and URLs remain synthetic in unit tests.
test('existing successful blob loading primes once and deduplicates overlapping calls', async () => {
  await fixture(async (video, requests, revoked) => {
    await Promise.all([loadClip(video as unknown as HTMLVideoElement), loadClip(video as unknown as HTMLVideoElement)]);
    assert.equal(video.dataset.state, 'ready');
    assert.deepEqual(requests, [video.dataset.src]);
    assert.deepEqual(video.sources, ['blob:https://example.test/clip']);
    assert.equal(video.plays, 1); assert.equal(video.pauses, 1);
    assert.equal(video.preload, 'auto'); assert.equal(video.loads, 1);
    assert.deepEqual(revoked, []);
  });
});

test('a blob rejection recovers with the existing same-origin media URL', async () => {
  await fixture(async (video, requests, revoked) => {
    video.rejectBlob = true;
    await loadClip(video as unknown as HTMLVideoElement);
    assert.equal(video.dataset.state, 'ready');
    assert.deepEqual(video.sources, ['blob:https://example.test/clip', video.dataset.src]);
    assert.equal(video.plays, 1); assert.equal(video.pauses, 1);
    assert.deepEqual(requests, [video.dataset.src]);
    assert.deepEqual(revoked, ['blob:https://example.test/clip']);
  });
});

test('source listeners exist before synchronous cached media events', async () => {
  await fixture(async (video) => {
    video.synchronous = true;
    await loadClip(video as unknown as HTMLVideoElement);
    assert.equal(video.dataset.state, 'ready');
    assert.equal(video.plays, 1); assert.equal(video.pauses, 1);
  });
});

test('failure of both media sources remains photographic and never primes', async () => {
  await fixture(async (video, _requests, revoked) => {
    video.rejectBlob = video.rejectNative = true;
    await loadClip(video as unknown as HTMLVideoElement);
    assert.equal(video.dataset.state, 'failed');
    assert.equal(video.sources.length, 2);
    assert.equal(video.plays, 0); assert.equal(video.pauses, 0);
    assert.deepEqual(revoked, ['blob:https://example.test/clip']);
  });
});
