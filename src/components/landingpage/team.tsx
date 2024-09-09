"use client";
import React from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
const people = [
  {
    id: 1,
    name: "Tanishq",
    designation: "Frontend and Backend Developer",
    image:
      "/profile_pic.png",
  },
  {
    id: 2,
    name: "Sushant",
    designation: "Team Leader",
    image:
      "/profile_pic.png",
  },
  {
    id: 3,
    name: "Ajay",
    designation: "AI/ML Developer",
    image:
      "/profile_pic.png",
  },
  {
    id: 4,
    name: "Prashanth",
    designation: "AI/ML Developer",
    image:
      "/profile_pic.png",
  },
  {
    id: 5,
    name: "Nidhi",
    designation: "Developer",
    image:
      "/profile_pic.png",
  },
  {
    id: 6,
    name: "Shreya",
    designation: "The Researcher",
    image:
      "/profile_pic.png",
  },
];

export function TeamLandingPage() {
  return (
    <div className="flex flex-row items-center justify-center mb-10 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
}
