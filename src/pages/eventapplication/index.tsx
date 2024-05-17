import React, { useEffect } from "react";
import { NextPage } from "next";
import { Sidebar } from "components/Sidebar";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@mantine/hooks";
import {
  AppShell,
  Button,
  Center,
  Checkbox,
  Group,
  LoadingOverlay,
  NumberInput,
  Radio,
  Stack,
  TextInput,
} from "@mantine/core";
import { createFormContext } from "@mantine/form";
import { v4 } from "uuid";
import { api } from "utils/api";
import { Prism } from "@mantine/prism";
import { EventApplicationForm } from "../../types/eventForm";

const [FormProvider, useFormContext, useForm] =
  createFormContext<EventApplicationForm>();

function ContextField() {
  const form = useFormContext();

  return (
    <>
      <Stack>
        <TextInput
          label="OSRS Name"
          placeholder="OSRS Name"
          withAsterisk
          {...form.getInputProps("osrsName")}
        />
        {/*This is not needed, can pull from user data*/}
        <TextInput
          label="Discord Name"
          placeholder="Discord Name"
          withAsterisk
          {...form.getInputProps("discordName")}
        />
        <Radio.Group
          name="teamCaptain"
          label="Do you want to be a team captain?"
          mt="xs"
          withAsterisk
          onChange={(value) => {
            form.setValues({
              ...form.values,
              teamCaptain: value === "true",
            });
          }}
          value={form.values.teamCaptain ? "true" : "false"}
        >
          <Group>
            <Radio value="true" label="Yes" />
            <Radio value="false" label="No" />
          </Group>
        </Radio.Group>
        <Checkbox.Group
          label="Please select content you have experience with:"
          withAsterisk
          {...form.getInputProps("experience")}
        >
          <Group mt="xs">
            <Checkbox
              value="Bossing"
              label="Mid-Level Bosses(ex. Zulrah, Muspah, Vorkath)"
            />
            <Checkbox value="TOA" label="Tombs of Amascut 300+ Invocation" />
            <Checkbox value="COX" label="Chambers of Xeric" />
            <Checkbox value="TOB" label="Theatre of Blood" />
            <Checkbox value="Inferno" label="Inferno" />
            <Checkbox value="COL" label="Colliseum" />
          </Group>
        </Checkbox.Group>
        {/*This can be automated by WOM API. If stats are too low, give popup on submission asking them to confirm they will reach stats in time*/}
        <NumberInput
          label="What is your current Combat level (must be 110+ by start of competition) and Slayer level?  Answer with cmb/slayer, i.e.126/99"
          placeholder=""
          {...form.getInputProps("combatLevel")}
        />
        {/*These values won't change and I don't know why*/}
        <Radio.Group
          name="hasAlt"
          label="Do you have an alt?"
          mt="xs"
          withAsterisk
          onChange={(value) => {
            form.setValues({
              ...form.values,
              hasAlt: value,
            });
          }}
          value={form.values.hasAlt}
        >
          <Group>
            <Radio value="No" label="No" />
            <Radio value="Supply Alt" label="Supply Alt" />
            <Radio value="Tank Alt" label="Tank Alt" />
            <Radio value="Multiple Alts" label="Multiple Alts" />
          </Group>
        </Radio.Group>
        {/*Make this only appear if 'No' is not selected for alts*/}
        {form.values.hasAlt !== "No" && (
          <TextInput
            label="Please list the in game name(s) the alt(s) account."
            placeholder=""
            {...form.getInputProps("reasonForGoodFitInput")}
          />
        )}
        {/*Could be automated by WOM API*/}
        <Radio.Group
          name="isIron"
          label="Are you an iron?"
          mt="xs"
          withAsterisk
          onChange={(value) => {
            form.setValues({
              ...form.values,
              isIron: value === "true",
            });
          }}
          value={form.values.isIron ? "true" : "false"}
        >
          <Group>
            <Radio value="true" label="Yes" />
            <Radio value="false" label="No" />
          </Group>
        </Radio.Group>
        {/*Only show for irons*/}
        {form.values.isIron && (
          <Radio.Group
            name="willSplit"
            label="Will you split as an iron?"
            mt="xs"
            withAsterisk
            onChange={(value) => {
              form.setValues({
                ...form.values,
                willSplit: value === "true",
              });
            }}
            value={form.values.willSplit ? "true" : "false"}
          >
            <Group>
              <Radio value="true" label="Yes" />
              <Radio value="false" label="No" />
            </Group>
          </Radio.Group>
        )}
        <NumberInput
          label="How many hours on average per day will you be able to invest in the bingo?"
          placeholder="Remember that this is a per-day average"
          withAsterisk
          {...form.getInputProps("hoursPerDay")}
        />
        <TextInput
          label="Are there any details you would like your potential captains to know about your schedule?"
          placeholder="For example, you will not be able to play one or more days. "
          withAsterisk
          {...form.getInputProps("scheduleDetails")}
        />
        <Radio.Group
          name="region"
          label="Region?"
          mt="xs"
          withAsterisk
          onChange={(value) => {
            form.setValues({
              ...form.values,
              region: value,
            });
          }}
          value={form.values.region}
        >
          <Group>
            <Radio value="NA" label="NA" />
            <Radio value="EU" label="EU" />
            <Radio value="Other" label="Other" />
          </Group>
        </Radio.Group>
        <NumberInput
          label="Bank value? (in millions)"
          placeholder="ex. 2.5b will be 2500"
          withAsterisk
          {...form.getInputProps("bankValue")}
        />
        <Checkbox.Group
          label="What weapons do you have?"
          withAsterisk
          {...form.getInputProps("weapons")}
        >
          <Group mt="xs">
            <Checkbox value="Tbow" label="Twisted Bow" />
            <Checkbox value="Shadow" label="Tumeken's Shadow" />
            <Checkbox value="Scythe" label="Scythe of Vitur" />
            <Checkbox value="BOWFA" label="Bow of Faerdhinin" />
            <Checkbox value="ZCB" label="Zaryte Crossbow" />
            <Checkbox value="None" label="None of the above" />
          </Group>
        </Checkbox.Group>
        <Radio.Group
          name="teamCaptain"
          label="Do you hereby accept and have read the rules of the competition and that you will not leave unannounced (real life happens just inform us in advance/when it happens) or attempt to cheat or bend the rules. Do you also accept that if you break the rules of the competition you will be removed from the competition, banned from all further cc events, lose rank if you have one, and possibly removed from the Aventus Clan and discord permanently.

If you need to leave, please inform us in 72 hours or sooner after the competition starts. Or even prior if possible. We will fully refund your buyin and replace you with a reserve. "
          mt="xs"
          withAsterisk
          onChange={(value) => {
            form.setValues({
              ...form.values,
              confirmRules: value === "true",
            });
          }}
          value={form.values.confirmRules ? "true" : "false"}
        >
          <Group>
            <Radio value="true" label="Yes" />
            <Radio
              value="false"
              label="No and I understand that my application to the event will be removed."
            />
          </Group>
        </Radio.Group>
      </Stack>
      <Button type="submit" mt="md">
        Submit
      </Button>
    </>
  );
}

const EventApplication: NextPage = (props) => {
  const { data: session } = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const utils = api.useContext();

  const {
    data: pendingEventApplications,
    fetchStatus: pendingEventApplicationsFetchStatus,
  } = api.eventApplication.findPendingEventApplicationsByUserId.useQuery({
    userId: (session?.user?.id as string) || "",
  });

  const {
    data: finalEventApplications,
    fetchStatus: finalEventApplicationsFetchStatus,
  } = api.eventApplication.findFinalizedEventApplicationsByUserId.useQuery({
    userId: (session?.user?.id as string) || "",
  });

  const insertEventApplication =
    api.eventApplication.insertOneEventApplication.useMutation({
      async onSuccess() {
        await utils.eventApplication.invalidate();
      },
    });

  const form = useForm({
    initialValues: {
      oid: "",
      osrsName: "",
      discordName: session?.user?.name || "",
      hasAlt: "No",
      altNames: "",
      teamCaptain: false,
      experience: [],
      combatLevel: 0,
      isIron: false,
      willSplit: true,
      hoursPerDay: 0,
      scheduleDetails: "",
      region: "NA",
      bankValue: 0,
      weapons: [],
      confirmRules: false,
      status: "Pending Review",
      submittingUserId: "",
      approvingUserId: "",
      approvingUserName: "",
    },
    validate: {
      osrsName: (osrsName) =>
        osrsName.length <= 0 ? "Please enter your OSRS name" : null,
      discordName: (discordName) =>
        discordName.length <= 0 ? "Please enter your Discord name" : null,
    },
  });

  useEffect(() => {
    if (pendingEventApplications && pendingEventApplications.length > 0) {
      form.setValues(pendingEventApplications[0] as EventApplicationForm);
    }
  }, [pendingEventApplications]);

  useEffect(() => {
    if (
      !form.values.submittingUserId &&
      session &&
      session.user &&
      session.user.id
    ) {
      form.setValues({
        ...form.values,
        submittingUserId: session.user.id,
      });
    }
  }, [session, form.values]);

  return (
    <>
      <main>
        <AppShell className="flex">
          <Sidebar />
          <Center maw={isMobile ? 400 : 700} mx="auto">
            {pendingEventApplicationsFetchStatus === "fetching" ||
            finalEventApplicationsFetchStatus === "fetching" ? (
              <LoadingOverlay visible={true} />
            ) : (
              <FormProvider form={form}>
                <form
                  onSubmit={form.onSubmit(() => {
                    console.log(form.values);
                    //Update DB here
                    insertEventApplication.mutate({
                      ...form.values,
                    });
                  })}
                >
                  <ContextField />
                </form>
              </FormProvider>
            )}
          </Center>

          {process.env.NODE_ENV === "development" && (
            <>
              {finalEventApplicationsFetchStatus === "fetching" ? (
                <div>Loading...</div>
              ) : (
                finalEventApplications &&
                finalEventApplications.length > 0 && (
                  <Prism language="json">
                    {JSON.stringify(finalEventApplications, null, `\t`)}
                  </Prism>
                )
              )}
            </>
          )}
        </AppShell>
      </main>
    </>
  );
};

export default EventApplication;
