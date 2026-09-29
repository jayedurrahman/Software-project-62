const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN?.trim();

declare global {
  interface Window {
    Paddle: any;
  }
}

export function getPaddleEnvironment(): "sandbox" | "live" {
  return clientToken?.startsWith("test_") ? "sandbox" : "live";
}

let paddleInitialized = false;
let paddleInitPromise: Promise<void> | null = null;

function configurePaddle() {
  if (!window.Paddle) throw new Error("Paddle.js failed to load");
  if (!clientToken) throw new Error("Paddle client-side token is missing");

  // Paddle only needs an explicit environment switch for sandbox.
  if (getPaddleEnvironment() === "sandbox") {
    window.Paddle.Environment.set("sandbox");
  }

  window.Paddle.Initialize({ token: clientToken });
  paddleInitialized = true;
}

export async function initializePaddle(): Promise<void> {
  if (paddleInitialized) return;
  if (paddleInitPromise) return paddleInitPromise;
  if (!clientToken) throw new Error("VITE_PAYMENTS_CLIENT_TOKEN is not set");

  paddleInitPromise = new Promise<void>((resolve, reject) => {
    try {
      if (window.Paddle) {
        configurePaddle();
        resolve();
        return;
      }

      const existing = document.querySelector<HTMLScriptElement>('script[data-paddle-js="true"]');
      if (existing) {
        existing.addEventListener("load", () => {
          try {
            configurePaddle();
            resolve();
          } catch (error) {
            reject(error);
          }
        }, { once: true });
        existing.addEventListener("error", () => reject(new Error("Could not load Paddle.js")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.dataset.paddleJs = "true";
      script.onload = () => {
        try {
          configurePaddle();
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      script.onerror = () => reject(new Error("Could not load Paddle.js"));
      document.head.appendChild(script);
    } catch (error) {
      reject(error);
    }
  }).finally(() => {
    if (!paddleInitialized) paddleInitPromise = null;
  });

  return paddleInitPromise;
}

const SANDBOX_PRICE_IDS: Record<string, string> = {
  hostel_monthly: "pri_01m3q9knsr63ggzncr0q69vcn3",
  hostel_yearly: "pri_01m3q9n8wmc5bfs9bpv42fexvs",
};

const LIVE_PRICE_IDS: Record<string, string> = {
  hostel_monthly: "pri_01m3q9knsr63ggzncr0q69vcn3",
  hostel_yearly: "pri_01m3q9n8wmc5bfs9bpv42fexvs",
};

export const PADDLE_PRICE_IDS = getPaddleEnvironment() === "sandbox"
  ? SANDBOX_PRICE_IDS
  : LIVE_PRICE_IDS;

export function getPaddlePriceId(planId: string): string {
  const priceId = PADDLE_PRICE_IDS[planId];
  if (!priceId) throw new Error(`Unknown plan: ${planId}`);
  return priceId;
}

export async function previewPaddlePrices() {
  await initializePaddle();
  return window.Paddle.PricePreview({
    items: [
      { priceId: PADDLE_PRICE_IDS.hostel_monthly, quantity: 1 },
      { priceId: PADDLE_PRICE_IDS.hostel_yearly, quantity: 1 },
    ],
  });
}

export async function openPaddleCheckout(
  planId: string,
  customData?: Record<string, string>
) {
  await initializePaddle();
  const priceId = getPaddlePriceId(planId);

  const checkout: Record<string, unknown> = {
    items: [{ priceId, quantity: 1 }],
    settings: {
      displayMode: "overlay",
      variant: "one-page",
      theme: "light",
    },
  };

  if (customData && Object.keys(customData).length > 0) {
    checkout.customData = customData;
  }

  window.Paddle.Checkout.open(checkout);
}
