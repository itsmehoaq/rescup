<template>
    <div class="mappool">
        <SubHeader
            :selections="[
                { text: $t('open.qualifiers.nav.mappool'), value: 'mappool' },
                { text: $t('open.qualifiers.nav.scores'), value: 'scores' },
            ]"
            :current-page="page"
            @update:page="changePage"
        />
        <div class="mappool__main_content">
            <OpenTitle>
                {{ $t('open.mappool.title') }}
                <template 
                    v-if="page === 'mappool'"
                    #right
                >
                    <StageSelector
                        :not-beginning="selectedStage !== stageList[0]"
                        :not-end="selectedStage !== stageList[stageList.length - 1]"
                        @prev="index--"
                        @next="index++"
                    >
                        <template #text>
                            {{ $t("open.components.stageSelector") }}
                        </template>

                        <template #stage>
                            {{ selectedStage?.abbreviation.toUpperCase() || '' }}
                        </template>
                    </StageSelector>
                    <!-- TODO: NOT MAKE THIS A STATIC LINK LOL -->
                    <ContentButton
                        class="content_button--red"
                        :link="'https://docs.google.com/spreadsheets/d/1Fzf9nzjPS8FeX4bR7Kyzj1qnpUB5xbXz0KwH-b7-5ic/edit?rm=minimal'"
                        :img-src="require('../../Assets/img/site/open/mappool/sheets-ico.svg')"
                        external
                    >
                        {{ $t('open.qualifiers.mappool.sheets') }}
                    </ContentButton>
                    <ContentButton
                        v-for="mappool in mappools"
                        :key="mappool.ID"
                        class="content_button--red"
                        :link="mappool.mappackLink || ''"
                        :img-src="require('../../Assets/img/site/open/mappool/dl-ico.svg')"
                        external
                    >
                        {{ $t('open.qualifiers.mappool.mappool') }} - {{ mappool.abbreviation.toUpperCase() }}
                    </ContentButton>
                </template>
                <template
                    v-else-if="page === 'scores'"
                    #right
                >
                    <StageSelector
                        :not-beginning="selectedStage !== stageList[0]"
                        :not-end="selectedStage !== stageList[stageList.length - 1]"
                        @prev="index--"
                        @next="index++"
                    >
                        {{ $t("open.components.stageSelector") }}

                        <template #stage>
                            {{ selectedStage?.abbreviation.toUpperCase() || '' }}
                        </template>
                    </StageSelector>
                    <div class="qualifiers__header_subtext">
                        {{ $t('open.qualifiers.scores.categorySelect') }}
                    </div>
                    <ContentButton 
                        class="content_button--header_button"
                        :class="{
                            'content_button--red': scoreView === 'players',
                            'content_button--red_outline': scoreView !== 'players',
                        }"
                        @click.native="scoreView = 'players'"
                    >
                        {{ $t('open.qualifiers.scores.players') }}
                    </ContentButton>
                    <ContentButton 
                        class="content_button--header_button"
                        :class="{
                            'content_button--red': scoreView === 'teams',
                            'content_button--red_outline': scoreView !== 'teams',
                        }"
                        @click.native="scoreView = 'teams'"
                    >
                        {{ $t('open.qualifiers.scores.teams') }}
                    </ContentButton>
                    <ContentButton
                        class="content_button--red content_button--font_sm"
                        @click.native="placementLock = !placementLock"
                    >
                        {{ placementLock ? $t('open.qualifiers.scores.lockedPlacement') : $t('open.qualifiers.scores.unlockedPlacement') }}
                    </ContentButton>
                </template>
            </OpenTitle>
            <div v-if="page === 'mappool' && mappools?.length !== 0">
                <MappoolView
                    v-for="mappool in mappools"
                    :key="mappool.ID"
                    :pool="mappool"
                />
            </div>
            <div v-else-if="loading">
                {{ $t("open.status.loading").toString().toLowerCase() }}...
            </div>
            <div v-else-if="page === 'mappool'">
                {{ $t("open.qualifiers.mappool.notAvailable") }}
            </div>
            <div v-if="page === 'scores'">
                <!-- TODO: Actually support multiple pools -->
                <ScoresView
                    v-for="mappool in mappools"
                    :key="mappool.ID"
                    :view="scoreView"
                    :placement-lock="placementLock"
                    :pool="mappool"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";

import { Tournament } from "../../Interfaces/tournament";
import { Stage } from "../../Interfaces/stage";
import { Round } from "../../Interfaces/round";
import { Mappool as MappoolInterface } from "../../Interfaces/mappool";
import { MatchupScore } from "../../Interfaces/matchup";

import MappoolView from "../../Assets/components/open/MappoolView.vue";
import OpenTitle from "../../Assets/components/open/OpenTitle.vue";
import ContentButton from "../../Assets/components/open/ContentButton.vue";
import StageSelector from "../../Assets/components/open/StageSelector.vue";
import ScoresView from "../../Assets/components/open/ScoresView.vue";
import SubHeader from "../../Assets/components/open/SubHeader.vue";

const openModule = namespace("open");

@Component({
    components: {
        StageSelector,
        MappoolView,
        OpenTitle,
        ContentButton,
        ScoresView,
        SubHeader,
    },
    head () {
        return {
            title: this.$store.state.open.title,
            meta: [
                {hid: "description", name: "description", content: "Resurrection Cup 2025 (also known as Resurrection Cup: Regulus Revolution), one of osu! standard's largest tournaments. Organized by Phreel and Hoaq, gathering some of the most skilled to the most strategic players from the community. All this to determine who's securing the winner's throne... until next year that is." || ""},

                {hid: "og:site_name", property: "og:site_name", content: "Resurrection Cup 2025"},
                {hid: "og:title", property: "og:title", content: "Resurrection Cup 2025"},
                {hid: "og:url", property: "og:url", content: `https://rescup.corsace.io${this.$route.path}`}, 
                {hid: "og:description", property: "og:description", content: "Resurrection Cup 2025 (also known as Resurrection Cup: Regulus Revolution), one of osu! standard's largest tournaments. Organized by Phreel and Hoaq, gathering some of the most skilled to the most strategic players from the community. All this to determine who's securing the winner's throne... until next year that is." || ""},
                {hid: "og:image",property: "og:image", content: require("../../Assets/img/site/open/banner.png")},
                
                {name: "twitter:title", content: "Resurrection Cup 2025"},
                {name: "twitter:description", content: "Resurrection Cup 2025 (also known as Resurrection Cup: Regulus Revolution), one of osu! standard's largest tournaments. Organized by Phreel and Hoaq, gathering some of the most skilled to the most strategic players from the community. All this to determine who's securing the winner's throne... until next year that is." || ""},
                {name: "twitter:image", content: require("../../Assets/img/site/open/banner.png")},
                {name: "twitter:image:src", content: require("../../Assets/img/site/open/banner.png")},
            ],
            link: [{rel: "canonical", hid: "canonical", href: `https://rescup.corsace.io${this.$route.path}`}],
        };
    },
})
export default class Mappool extends Vue {
    loading = false;
    page: "mappool" | "scores" = "mappool";
    scoreView: "players" | "teams" = "teams";
    placementLock = false;

    @openModule.State tournament!: Tournament | null;
    @openModule.State mappools!: MappoolInterface[] | null;
    @openModule.State scores!: MatchupScore[] | null;

    stageList: (Stage | Round)[] = [];
    index = -1;
    
    get selectedStage (): Stage | Round | null {
        return this.stageList[this.index] || null;
    }

    @Watch("selectedStage")
    async stageScoresAndMappools () {
        this.loading = true;
        if (!this.selectedStage) {
            this.$store.commit("open/setMappools", []);
            this.$store.commit("open/setScores", []);
            this.loading = false;
            return;
        }
        
        const ID = this.selectedStage.ID;
        this.$store.commit("open/setMappools", []);
        this.$store.commit("open/setScores", []);

        await this.pause(500);
        if (ID !== this.selectedStage.ID) return;

        await this.$store.dispatch("open/setMappools", this.selectedStage);
        if (this.page === "scores")
            await this.$store.dispatch("open/setScores", this.selectedStage);
        this.loading = false;
    }

    async changePage (page: "mappool" | "scores") {
        if (page === this.page)
            return;
        if (page === "scores" && !this.selectedStage)
            return;
        if (page === "scores" && (!this.scores || this.scores.length === 0))
            await this.$store.dispatch("open/setScores", this.selectedStage);
        this.page = page;
    }

    async pause (ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    mounted () {
        for(const stage of (this.tournament?.stages ?? [])) {
            if (stage.rounds.length < 2) {
                this.stageList.push(stage);
                if(this.index === -1 && stage.timespan.end > new Date()) {
                    this.index = this.stageList.length - 1;
                }
            } else {
                for(const round of stage.rounds) {
                    this.stageList.push(round);
                    if(this.index === -1 && stage.timespan.end > new Date()) {
                        this.index = this.stageList.length - 1;
                    }
                }
            }
        }
        if (this.index === -1)
            this.index = this.stageList.length - 1;
    }
}
</script>

<style lang="scss">
@import '@s-sass/_variables';
.mappool {
    overflow: auto;

    &__main_content {
        align-self: center;
        position: relative;
        width: 65vw;
        padding: 35px;
    }
}
</style>