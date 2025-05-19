<template>
    <div>
        <h1>Matchup</h1>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
    components: {
    },
    head () {
        return {
            title: this.$store.state.open.title,
            meta: [
                {hid: "description", name: "description", content: "Resurrection Cup 2025 (also known as Resurrection Cup: Regulus Revolution), one of osu! standard's largest tournaments. Organized by Phreel and Hoaq, gathering some of the most skilled to the most strategic players from the community. All this to determine who's securing the winner's throne... until next year that is." || ""},

                {hid: "og:site_name", property: "og:site_name", content: "Resurrection Cup 2025"},
                {hid: "og:title", property: "og:title", content: "Resurrection Cup 2025"},
                {hid: "og:url", property: "og:url", content: `https://rescup.xyz${this.$route.path}`},
                {hid: "og:description", property: "og:description", content: "Resurrection Cup 2025 (also known as Resurrection Cup: Regulus Revolution), one of osu! standard's largest tournaments. Organized by Phreel and Hoaq, gathering some of the most skilled to the most strategic players from the community. All this to determine who's securing the winner's throne... until next year that is." || ""},
                {hid: "og:image",property: "og:image", content: require("../../../Assets/img/site/open/banner.png")},
                
                {name: "twitter:title", content: "Resurrection Cup 2025"},
                {name: "twitter:description", content: "Resurrection Cup 2025 (also known as Resurrection Cup: Regulus Revolution), one of osu! standard's largest tournaments. Organized by Phreel and Hoaq, gathering some of the most skilled to the most strategic players from the community. All this to determine who's securing the winner's throne... until next year that is." || ""},
                {name: "twitter:image", content: require("../../../Assets/img/site/open/banner.png")},
                {name: "twitter:image:src", content: require("../../../Assets/img/site/open/banner.png")},
            ],
            link: [{rel: "canonical", hid: "canonical", href: `https://rescup.xyz${this.$route.path}`}],
        };
    },
    validate ({ params }) {
        return !params.id || !isNaN(parseInt(params.id));
    },
})
export default class Matchup extends Vue {

    async mounted () {
        //
    }

}
</script>

<style lang="scss">

</style>