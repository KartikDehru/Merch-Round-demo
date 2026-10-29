"use client";

import { ACTION, ARTIST_SLIDES, FAN_SLIDES } from "@/lib/copy";
import { ArtistSlide, FanSlide } from "./demo-slides";
import { PhoneCarousel } from "./phone-carousel";

export function ActionCarousels() {
  return (
    <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-10">
      <PhoneCarousel label={ACTION.artistLabel} stepNames={ARTIST_SLIDES} renderSlide={(i) => <ArtistSlide index={i} />} />
      <PhoneCarousel label={ACTION.fanLabel} stepNames={FAN_SLIDES} renderSlide={(i) => <FanSlide index={i} />} />
    </div>
  );
}
