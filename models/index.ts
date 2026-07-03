/**
 * Importing this module guarantees every schema is registered with Mongoose
 * before any `populate()` runs (avoids MissingSchemaError in serverless).
 */
export { default as User } from "./User";
export { default as Partner } from "./Partner";
export { default as Trip } from "./Trip";
export { default as PartnerTrip } from "./PartnerTrip";
export { default as Booking } from "./Booking";
export { default as Payment } from "./Payment";
export { default as Commission } from "./Commission";
export { default as Review } from "./Review";
export { default as Wishlist } from "./Wishlist";
export { default as Notification } from "./Notification";
export { default as Settings, getSettings } from "./Settings";
