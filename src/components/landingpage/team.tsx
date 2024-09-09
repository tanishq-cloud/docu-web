"use client";
import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
const people = [
  {
    id: 1,
    name: "Tanishq",
    designation: "Team Member",
    image:
      "/tanishq.jpeg",
  },
  {
    id: 2,
    name: "Sushant",
    designation: "Team Leader",
    image:
      "/sushant.jpeg",
  },
  {
    id: 3,
    name: "Ajay",
    designation: "Team Member",
    image:
      "/ajay.jpeg",
  },
  {
    id: 4,
    name: "Prashanth",
    designation: "Team Member",
    image:
      "/prashanth.jpeg",
  },
  {
    id: 5,
    name: "Nidhi",
    designation: "Team Member",
    image:
      "/nidhi.png",
  },
  {
    id: 6,
    name: "Shreya",
    designation: "Team Member",
    image:
      "/shreya.jpeg",
  },
];

export function TeamLandingPage() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
