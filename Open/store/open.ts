import { ActionTree, MutationTree, GetterTree } from "vuex";
import { Tournament } from "../../Interfaces/tournament";
import { BaseTeam, TeamList, Team, TeamInvites } from "../../Interfaces/team";
import { BaseQualifier } from "../../Interfaces/qualifier";
import { OpenStaffInfo, StaffList } from "../../Interfaces/staff";
import { MatchupList, MatchupScore } from "../../Interfaces/matchup";
import { Mappool } from "../../Interfaces/mappool";

export interface OpenState {
    title: string;
    tournament: Tournament | null;
    teamList: TeamList[] | null;
    myTeams: Team[] | null;
    inviteList: TeamInvites[] | null;
    teamInvites: BaseTeam[] | null;
    qualifierList: BaseQualifier[] | null;
    matchupList: MatchupList[] | null;
    mappools: Mappool[] | null;
    scores: MatchupScore[] | null;
    staffInfo: OpenStaffInfo | null;
    staffList: StaffList[] | null;
}

export const state = (): OpenState => ({
    title: "",
    tournament: null,
    teamList: null,
    myTeams: null,
    inviteList: null,
    teamInvites: null,
    qualifierList: null,
    matchupList: null,
    mappools: null,
    scores: null,
    staffInfo: null,
    staffList: null,
});

export const mutations: MutationTree<OpenState> = {
    setTitle(openState, year: number | undefined) {
        openState.title = `Resurrection Cup ${year}` || "";
    },
    setTournament(openState, tournament: Tournament | undefined) {
        if (tournament) {
            openState.tournament = {
                ...tournament,
                createdAt: new Date(tournament.createdAt),
                organizer: {
                    ...tournament.organizer,
                    joinDate: new Date(tournament.organizer.joinDate),
                    lastLogin: new Date(tournament.organizer.lastLogin),
                },
                registrations: {
                    start: new Date(tournament.registrations.start),
                    end: new Date(tournament.registrations.end),
                },
                stages: tournament.stages.map(stage => ({
                    ...stage,
                    createdAt: new Date(stage.createdAt),
                    timespan: {
                        start: new Date(stage.timespan.start),
                        end: new Date(stage.timespan.end),
                    },
                    rounds: stage.rounds.map(round => ({
                        ...round,
                        mappool: round.mappool?.map(mappool => ({
                            ...mappool,
                            createdAt: new Date(mappool.createdAt),
                            mappackExpiry: mappool.mappackExpiry ? new Date(mappool.mappackExpiry) : null,
                            slots: mappool.slots.map(slot => ({
                                ...slot,
                                createdAt: new Date(slot.createdAt),
                            })),
                        })) || [],
                    })),
                    mappool: stage.mappool?.map(mappool => ({
                        ...mappool,
                        createdAt: new Date(mappool.createdAt),
                        mappackExpiry: mappool.mappackExpiry ? new Date(mappool.mappackExpiry) : null,
                        slots: mappool.slots.map(slot => ({
                            ...slot,
                            createdAt: new Date(slot.createdAt),
                        })),
                    })) || [],
                })),
            };

            openState.tournament.stages.sort((a, b) => a.order - b.order);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            openState.tournament.schedule = [
                {
                    event: "Registrations",
                    start: "2025-05-11T00:00:00.000Z",
                    end: "2025-06-01T00:00:00.000Z",
                },
                {
                    event: "Screening Intermission",
                    start: "2025-06-01T00:00:00.000Z",
                    end: "2025-06-08T00:00:00.000Z",
                },
                {
                    event: "Qualifiers",
                    start: "2025-06-08T00:00:00.000Z",
                    end: "2025-06-15T00:00:00.000Z",
                },
                {
                    event: "Round of 32",
                    start: "2025-06-16T00:00:00.000Z",
                    end: "2025-06-22T00:00:00.000Z",
                },
                {
                    event: "Round of 16",
                    start: "2025-06-23T00:00:00.000Z",
                    end: "2025-06-29T00:00:00.000Z",
                },
                {
                    event: "Quarterfinals",
                    start: "2025-06-30T00:00:00.000Z",
                    end: "2025-07-06T00:00:00.000Z",
                },
                {
                    event: "Semifinals",
                    start: "2025-07-07T00:00:00.000Z",
                    end: "2025-07-13T00:00:00.000Z",
                },
                {
                    event: "Finals",
                    start: "2025-07-14T00:00:00.000Z",
                    end: "2025-07-20T00:00:00.000Z",
                },
                {
                    event: "Grand Finals",
                    start: "2025-07-21T00:00:00.000Z",
                    end: "2025-07-27T00:00:00.000Z",
                },
            ];
        }
    },
    setTeamList(openState, teams: TeamList[] | undefined) {
        openState.teamList = teams ?? null;
        if (!openState.teamList)
            return;
        openState.teamList
            .sort((a, b) => a.BWS - b.BWS)
            .sort((a, b) => (a.BWS === 0 ? 1 : 0) - (b.BWS === 0 ? 1 : 0));
    },
    addTeamList(openState, team: TeamList | undefined) {
        if (!openState.teamList)
            openState.teamList = [];

        if (team)
            openState.teamList.push(team);
    },
    setMyTeams(openState, teams: Team[] | undefined) {
        openState.myTeams = teams ?? null;
    },
    setTeamInvites(openState, invites: TeamInvites[] | undefined) {
        openState.inviteList = invites ?? null;
    },
    setInvites(openState, invites: BaseTeam[] | undefined) {
        openState.teamInvites = invites ?? null;
    },
    addInvite(openState, invite: BaseTeam | undefined) {
        if (!openState.teamInvites)
            openState.teamInvites = [];

        if (invite)
            openState.teamInvites.push(invite);
    },
    setQualifierList(openState, qualifiers: BaseQualifier[] | undefined) {
        openState.qualifierList = qualifiers?.map(q => ({
            ...q,
            date: new Date(q.date),
        })) ?? null;
    },
    setMatchups(openState, matchups: MatchupList[] | undefined) {
        openState.matchupList = matchups?.map(matchup => {
            matchup.date = new Date(matchup.date);
            return matchup;
        }) ?? [];
        openState.matchupList.sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    setMappools(openState, mappools: Mappool[] | undefined) {
        openState.mappools = mappools?.map(mappool => ({
            ...mappool,
            createdAt: new Date(mappool.createdAt),
            mappackExpiry: mappool.mappackExpiry ? new Date(mappool.mappackExpiry) : null,
            slots: mappool.slots.map(slot => ({
                ...slot,
                createdAt: new Date(slot.createdAt),
            })),
        })) ?? [];
    },
    setScores(openState, scores: MatchupScore[] | undefined) {
        openState.scores = scores ?? null;
    },
    setStaffInfo(openState, info: OpenStaffInfo | undefined) {
        openState.staffInfo = info ?? null;
    },
    setStaffList(openState, staff: StaffList[] | undefined) {
        openState.staffList = staff ?? null;
    },
};

export const getters: GetterTree<OpenState, OpenState> = {};

export const actions: ActionTree<OpenState, OpenState> = {
    async setTournament({ commit, dispatch }) {
        const { data } = await this.$axios.get<{ tournament: Tournament }>(`/api/tournament/10`);

        if (data.success) {
            commit("setTournament", data.tournament);
            commit("setTitle", data.tournament.year);
            await dispatch("setStaffInfo", data.tournament.ID);
        }
    },
    async setTeamList({ commit }, tournamentID) {
        const { data } = await this.$axios.get<{ teams: TeamList[] }>(`/api/tournament/${tournamentID}/teams`);

        if (data.success)
            commit("setTeamList", data.teams);
    },
    async setMyTeams({ commit, dispatch }) {
        const { data } = await this.$axios.get<{ teams: Team[] }>(`/api/team`);

        if (data.success)
            commit("setMyTeams", data.teams);

        await dispatch("setTeamInvites");
    },
    async setTeamInvites({ commit }) {
        const { data } = await this.$axios.get<{ invites: TeamInvites[] }>(`/api/team/invite/teams`);

        if (data.success)
            commit("setTeamInvites", data.invites);
    },
    async setInvites({ commit }) {
        const { data } = await this.$axios.get<{ invites: BaseTeam[] }>(`/api/team/invite/user`);

        if (data.success)
            commit("setInvites", data.invites);
    },
    async setQualifierList({ commit }, tournamentID) {
        const { data } = await this.$axios.get<{
            qualifiers: BaseQualifier[]
        }>(`/api/tournament/${tournamentID}/qualifiers`);

        if (data.success)
            commit("setQualifierList", data.qualifiers);
    },
    async setMatchups({ commit }, stageID) {
        if (!stageID || isNaN(parseInt(stageID)))
            return;

        const { data } = await this.$axios.get<{ matchups: MatchupList[] }>(`/api/stage/${stageID}/matchups`);

        if (data.success)
            commit("setMatchups", data.matchups);
    },
    async setMappools({ commit }, stageID) {
        if (!stageID || isNaN(parseInt(stageID)))
            return;

        const { data } = await this.$axios.get<{ mappools: Mappool[] }>(`/api/stage/${stageID}/mappools`);

        if (data.success)
            commit("setMappools", data.mappools);
    },
    async setScores({ commit }, stageID) {
        if (!stageID || isNaN(parseInt(stageID)))
            return;

        const { data } = await this.$axios.get<{ scores: MatchupScore[] }>(`/api/stage/${stageID}/scores`);

        if (data.success)
            commit("setScores", data.scores);
    },
    async setStaffInfo({ commit }, tournamentID) {
        const { data } = await this.$axios.get<{ info: OpenStaffInfo }>(`/api/tournament/${tournamentID}/staffInfo`);

        if (data.success)
            commit("setStaffInfo", data.info);
    },
    async setStaffList({ commit }) {
        // const { data } = await this.$axios.get<{ staff: StaffList[] }>(`/api/tournament/${tournamentID}/staff`);
        const response = await fetch("https://static.rescup.xyz/staff.json");

        if (!response.ok) {
            return;
        }
        const staff = await response.json();

        if (staff)
            commit("setStaffList", staff);
    },
    async setInitialData({ dispatch }, year) {
        await Promise.all([
            dispatch("setTournament", year),
            dispatch("setMyTeams"),
            dispatch("setInvites"),
        ]);
    },
};
