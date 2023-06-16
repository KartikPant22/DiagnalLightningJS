import { Lightning, Utils } from '@lightningjs/sdk'

export default class TrayItems extends Lightning.Component {
    static _template() {
        return {
            // Main container for the Trays
            MainContainer: {
                h: 200,
                w: 140,
                // Tray poster container
                TrayItemsContainer: {
                    h: 200,
                    w: 140,
                    shader: { type: Lightning.shaders.RoundedRectangle, radius: 10 },
                },
                // Green colored focus for the Tray poster
                TrayFocus: {
                    x: -5,
                    y: -5,
                    smooth: {
                        texture: Lightning.Tools.getRoundRect(
                            0,
                            0,
                            5,
                            7,
                            0xff212121,
                            false,
                            0xff212121 //0xff212121,
                        )
                    }
                },
                // Tray movie title
                MovieTitle: {
                    y: 205,
                    text: {
                        fontSize: 14,
                        textColor: 0xffffffff,
                        fontFace: "Regular",
                        cutEx: 130,
                    }
                }
            }
        }
    }

    // During focus tray backgound should become Green
    _focus() {
        this.tag("TrayFocus").patch({
            smooth: {
                texture: Lightning.Tools.getRoundRect(
                    141,
                    201,
                    5,
                    7,
                    0xff00ff0c,
                    false,
                    0xff212121 //0xff212121,
                ),
            },
        });
        // This is for change the backgound spotlight details
        this.application.emit("backgroundChanger", this.allDataReceived)
    }

    // During unfocus tray backgound should remove
    _unfocus() {
        this.tag("TrayFocus").patch({
            smooth: {
                texture: Lightning.Tools.getRoundRect(
                    0,
                    0,
                    5,
                    7,
                    0xff212121,
                    false,
                    0xff212121 //0xff212121,
                ),
            },
        });
    }

    // Setting the Tray image and Movie title
    set imageContainer(images) {
        // Setting the placeholder for the missing poster
        this.tag("TrayItemsContainer").on("txError", () => {
            this.tag("TrayItemsContainer").src = Utils.asset("./images/placeholder_for_missing_posters.png")
        })
        // Setting the value for backound spotlight details, Tray poster and Tray movie title
        this.allDataReceived = images;
        // Setting the poster
        this.tag("TrayItemsContainer").src = this.allDataReceived.imageSrc;
        // Tray movie title with fallback case
        this.tag("MovieTitle").text.text = this.allDataReceived.PosterTitle || "No Title";
    }
}
