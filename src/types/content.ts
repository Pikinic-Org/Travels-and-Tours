// The site-content shapes still live beside their pure helpers in lib/data;
// they're re-exported here so every type can be imported from "@/types".
export type { FlightOffer } from "@/lib/data/flights";
export type { Package } from "@/lib/data/packages";
export type { BlogPost, BlogContentBlock } from "@/lib/data/blog";
