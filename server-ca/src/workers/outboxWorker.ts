interface OutboxWorkerDependencies {
  processOutboxJobs: () => Promise<void>;
}

const POLL_INTERVAL_MS = 5_000;

export default function makeOutboxWorker({
  processOutboxJobs,
}: OutboxWorkerDependencies) {
  let stopped = false;

  return {
    async start() {
      while (!stopped) {
        try {
          await processOutboxJobs();
        } catch (error) {
          console.error("Outbox worker failed:", error);
        }

        if (!stopped) {
          await new Promise<void>((resolve) => {
            setTimeout(resolve, POLL_INTERVAL_MS);
          });
        }
      }
    },

    stop() {
      stopped = true;
    },
  };
}
