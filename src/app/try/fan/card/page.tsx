"use client";

import { FanCheckoutForm } from "@/components/fan-checkout-form";
import { TryScreen } from "@/components/try-chrome";

export default function FanCardPage() {
  return (
    <TryScreen step={2} total={6} title="Save your card">
      <FanCheckoutForm />
    </TryScreen>
  );
}
