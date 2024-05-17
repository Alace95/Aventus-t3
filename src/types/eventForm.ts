export interface EventApplicationForm {
  oid: string;
  osrsName: string;
  discordName: string;
  teamCaptain: boolean;
  experience: string[];
  combatLevel: string;
  hasAlt: string;
  altNames: string;
  isIron: boolean;
  willSplit: boolean;
  hoursPerDay: string;
  scheduleDetails: string;
  region: string;
  bankValue: string;
  weapons: string[];
  confirmRules: boolean;
  status: string;
  submittingUserId: string;
  approvingUserId: string | undefined;
  approvingUserName: string | undefined;
}