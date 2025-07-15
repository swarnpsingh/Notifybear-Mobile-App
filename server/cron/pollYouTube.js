import YouTubeService from '../services/YouTubeService.js';

(async () => {
  try {
    console.log('[CRON] Starting YouTube polling...');
    await YouTubeService.pollAllCreators();
    console.log('[CRON] Finished YouTube polling.');
  } catch (err) {
    console.error('[CRON] Error during YouTube polling:', err);
  } finally {
    process.exit();
  }
})(); 