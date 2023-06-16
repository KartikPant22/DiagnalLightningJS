import { Lightning, Utils } from '@lightningjs/sdk'

export default class DynamicSpotlight extends Lightning.Component {
    static _template() {
        return {
            w: (w) => w,
            h: (h) => h,
            // Backgound spotlight movie title
            MovieTitle: {
                y: 20, 
                text: {
                    fontSize: 28,
                    textColor: 0xffffffff,
                    fontFace: "Bold",
                }
            },
            // Backgound spotlight movie details
            MovieDetails: {
                y: 70,
                text: {
                    fontSize: 24,
                    textColor: 0xffffffff,
                    maxLines: 2,
                    wordWrapWidth: 550,
                    maxLinesSuffix: "...",
                    wordWrap: true,
                    cutEx: 550,
                    fontFace: "Regular",
                }
            },
        }
    }

    // Setting the backound movie title and details
    _setup() {
        this.application.on("backgroundChanger", (data) => {
            // Backgound spotlight movie title with fallback case
            this.tag("MovieTitle").text.text = data.PosterTitle || "No Title";
            // Backgound spotlight movie details with fallback case
            this.tag("MovieDetails").text.text = data.Details || "No Details";
        })
    }
}
