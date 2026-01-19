import { sendGAEvent } from "@next/third-parties/google";
import Decimal from "decimal.js";

Decimal.set({ rounding: Decimal.ROUND_DOWN });

export function truncateAddress(address, index = 5) {
  if (!address || typeof address !== "string") return "";
  return `${address.slice(0, index)}...${address.slice(address.length - index)}`;
}

export const formatNumber = (amount, maxDigit = 6) => {
  const number = new Decimal(amount);
  const flooredNumber = number.toDecimalPlaces(maxDigit).toString();

  const parts = flooredNumber.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const sendGA4 = ({ eventName, params }) => {
  sendGAEvent("event", eventName, params);
};
