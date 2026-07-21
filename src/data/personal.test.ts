import { describe, expect, it } from "vitest";
import { allProjects, experience, publicProfileData } from "./personal";

describe("public portfolio data", () => {
  it("provides one stable, unique id for every project", () => {
    const ids = allProjects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(Boolean)).toBe(true);
  });

  it("identifies the current role without an invented end date", () => {
    const currentRoles = experience.filter((role) => role.end === null);
    expect(currentRoles).toHaveLength(1);
    expect(currentRoles[0]?.company).toBe("GBG Group Services");
  });

  it("contains the sections required by CV consumers", () => {
    expect(publicProfileData.profile.email).toContain("@");
    expect(publicProfileData.education.length).toBeGreaterThan(0);
    expect(publicProfileData.coreSkills.length).toBeGreaterThan(0);
    expect(publicProfileData.experience.length).toBeGreaterThan(0);
    expect(publicProfileData.projects.length).toBeGreaterThan(0);
    expect(publicProfileData.certifications.length).toBeGreaterThan(0);
  });
});

