import { Lightning, Registry, Utils } from '@lightningjs/sdk'
import CONTENTLISTINGAPI1 from './api/CONTENTLISTINGPAGE-PAGE1.json';
import CONTENTLISTINGAPI2 from './api/CONTENTLISTINGPAGE-PAGE2.json';
import CONTENTLISTINGAPI3 from './api/CONTENTLISTINGPAGE-PAGE3.json';
import { List } from '@lightningjs/ui';
import DynamicSpotlight from './DymanicSpotlight';
import TrayItems from './TrayItems';

export default class App extends Lightning.Component {
  static getFonts() {
    return [
      { family: "Regular", url: Utils.asset("fonts/TitilliumWeb-Regular.ttf") },
      { family: "Light", url: Utils.asset("fonts/TitilliumWeb-Light.ttf") },
      { family: "Bold", url: Utils.asset("fonts/TitilliumWeb-Bold.ttf") },
    ];
  }
  static _template() {
    return {
      // Creating a main container, every UI components would inside this container
      MainContainer: {
        w: 1280,
        h: 720,
        rect: true,
        color: 0xff141414,
        flex: {
          direction: "column",
          alignItems: "center",
          justifyContent: "center"
        },
        // Container which contains Main Title and Clock
        TitleAndTimer: {
          w: 1280,
          h: 100,
          flex: {
            direction: "row",
            justifyContent: "center",
            alignItems: "center",
          },
          flexItem: { marginLeft: 300, marginTop: -20 },
          // Main Title
          MainTitle: {
            w: 600,
            h: 150,
            TextContainer: {
              text: {
                text: "LIGHTNING WORKSHOP",
                fontFace: "Light",
                fontSize: 26,
                textColor: 0xffffffff
              }
            }
          },
          // Clock
          ClockContainer: {
            flexItem: false,
            w: 550,
            h: 100,
            x: 990,
            y: -30,
            ClockText: {
              text: {
                fontSize: 36,
                textColor: 0xff747474,
                fontFace: "Regular",
              }
            }
          }
        },
        // Background Spotlight
        SpotlightContainer: {
          w: 1100,
          h: 200,
          y: -70,
          type: DynamicSpotlight
        },
        // Container for Tray
        TrayContainer: {
          w: 1100,
          h: 300,
          signals: { onRequestItems: "onRequestItems" },
          requestThreshold: 5,
          enableRequests: true,
          type: List,
          direction: "row",
          TitleContainer: {
            y: -50,
            text: {
              textColor: 0xffffffff,
              fontSize: 26,
            }
          },
          spacing: 20,
        }
      }
    }
  }

  // Setting focus on Tray
  _getFocused() {
    return this.tag("TrayContainer");
  }

  // Fucntion to add the Zero as well in the Clock
  addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  // Initialising the Clock and starting fucntionality for the tray and background
  _init() {
    // Registry for the Clock for each second and for better uer experience
    Registry.setInterval(() => {
      var d = new Date();
      var h = this.addZero(d.getHours());
      var m = this.addZero(d.getMinutes());
      this.tag("ClockText").text = h + ":" + m
    }, 1000)
    // Calling all JSON file under one array
    this.allApiResponse = [CONTENTLISTINGAPI1, CONTENTLISTINGAPI2, CONTENTLISTINGAPI3];
    //Setting the first/current page
    this.currentPage = 0;
    // Vairiable to track the total
    this.total = 0;
    // Setting first JSON's total content items
    this.allItems = CONTENTLISTINGAPI1.page["total-content-items"];
    // Setting the Tray Main Title
    this.tag("TrayContainer.TitleContainer").text.text = `${CONTENTLISTINGAPI1.page.title}`;
    // Calling the function to setup the Trays
    this.tag("TrayContainer").items = this.portraitTray();
  }

  // Function to setup the Trays
  portraitTray() {
    try {
      if (this.currentPage <= this.allApiResponse?.length && this.total < this.allItems) {
        let allContent = this.allApiResponse[this.currentPage]
        if (allContent?.page["content-items"].content?.length > 0) {
          let content = [];
          allContent.page["content-items"].content.forEach((element) => {
            content.push({
              h: 200,
              w: 140,
              type: TrayItems,
              imageContainer: {
                imageSrc: Utils.asset(`./images/${element["poster-image"]}`),
                Details: element.description,
                PosterTitle: element.name,
              },
            });
          });
          this.currentPage++;
          this.total = this.total + allContent.page["page-size"]
          this.tag("TrayContainer").add(content);
          return content
        }
      }
    }
    catch (err) {
      console.log("ERROR", err);
    }
  }

  // Requesting for the more trays
  async onRequestItems() {
    try {
      let items = this.portraitTray();
      this.tag("TrayContainer").add(items);
      return items?.length > 0 ? true : false;
    }
    catch (err) {
      console.log("ERROR", err);
    }
  }

  // Inactiving the Registry for the better performance
  _inactive() {
    Registry.clearIntervals()
  }
}
