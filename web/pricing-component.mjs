import {PolymerElement, html} from "https://unpkg.com/@polymer/polymer@3.2.0/polymer-element.js?module"
import "https://widgets.risevision.com/stable/components/pricing/pricing-data-component.mjs"
import "https://widgets.risevision.com/stable/components/pricing/pricing-selector-component.mjs"
import "https://widgets.risevision.com/stable/components/pricing/pricing-summary-component.mjs"
import "https://widgets.risevision.com/stable/components/pricing/pricing-grid-component.mjs"

class PricingComponent extends PolymerElement {
  static get properties() {
    return {
      pricingData: {type: Object, value: {}},
      displayCount: {type: Number, value: 5, notify: true},
      prodEnv: {type: Boolean, value: false},
      priceTotal: {type: Number, value: 0},
      period: {type: String, value: "yearly"},
      applyDiscount: {type: Boolean, value: false},
      dataLoading: {type: Boolean, computed: "isDataLoading(pricingData)"},
      dataLoaded: {type: Boolean, computed: "isDataLoaded(pricingData)"}
    };
  }

  isDataLoaded(pricingData) {return pricingData && Object.keys(pricingData).length && !pricingData.failed;}
  isDataLoading(pricingData) {return !pricingData || !Object.keys(pricingData).length;}

  static get template() {
    return html`
      <style>
        .component {
          width: 100%;
        }

        section.middle {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1em;
        }

        section.middle pricing-selector-component {
          display: inline-block;
          width: 40%;
          vertical-align: top;
          border: solid 1px #979797;
          border-radius: 5px;
          box-sizing: border-box;
          padding: 1em;
        }

        section.middle pricing-grid-component {
          display: inline-block;
          width: 58%;
          vertical-align: top;
        }

        pricing-summary-component {
          display: block;
          border: solid 1px #979797;
          padding: 0.5em;
          margin-bottom: 1em;
          box-sizing: border-box;
        }

        #billingHelp {
          display: block;
          text-align: right;
          color: #979797;
          margin: 1em 0 0.5em 0;
        }
      </style>

      <section hidden$=[[!dataLoaded]]>
        <pricing-data-component prod-env=[[prodEnv]] pricing-data={{pricingData}}></pricing-data-component>

        <pricing-selector-component class="component"
          show-period-section
          pricing-data=[[pricingData]]
          display-count=[[displayCount]]
          period={{period}}>
        </pricing-selector-component>

        <div id="billingHelp">Price per Display, per month, billed [[period]]</div>

        <section class="middle">
          <pricing-selector-component class="component"
            show-display-count-section
            display-count={{displayCount}}>
          </pricing-selector-component>

          <pricing-grid-component class="component" 
            pricing-data=[[pricingData]]
            period=[[period]]
            tier-name={{tierName}}
            display-count=[[displayCount]]>
          </pricing-grid-component>
        </section>

        <pricing-summary-component class="component"
          pricing-data=[[pricingData]]
          price-total={{priceTotal}}
          display-count=[[displayCount]]
          period=[[period]]
          apply-discount=[[applyDiscount]]>
        </pricing-summary-component>
      </section>
      <section hidden$=[[!pricingData.failed]]>
        Failed load
      </section>
      <section hidden$=[[!dataLoading]]>
        Loading
      </section>
    `;
  }
}

window.customElements.define("pricing-component", PricingComponent);
console.log("Registered pricing component");
