export interface EventApplicationForm {
  oid: string;
  osrsName: string;
  discordName: string;
  teamCaptain: boolean;
  experience: string[];
  combatLevel: number;
  hasAlt: string;
  altNames: string;
  isIron: boolean;
  willSplit: boolean;
  hoursPerDay: number;
  scheduleDetails: string;
  region: string;
  bankValue: number;
  weapons: string[];
  confirmRules: boolean;
  status: string;
  submittingUserId: string;
  approvingUserId: string | undefined;
  approvingUserName: string | undefined;
}