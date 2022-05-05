var getScriptPromisify = (src) => {
  return new Promise(resolve => {
    $.getScript(src, resolve)
  })
}

(function () {
  const prepared = document.createElement('template')
  prepared.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
    `
  class EvonikPieChart extends HTMLElement {
    constructor () {
      super()

      this._shadowRoot = this.attachShadow({ mode: 'open' })
      this._shadowRoot.appendChild(prepared.content.cloneNode(true))

      this._root = this._shadowRoot.getElementById('root')

		this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
		});

      this._props = {}

      this.render()
    }

    onCustomWidgetResize (width, height) {
      this.render()
    }


    set myDataSource (dataBinding) {
      this._myDataSource = dataBinding
      this.render()
    }

    async render () {
  	  console.log(">> render() - HM");
      await getScriptPromisify('https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js')

      if (!this._myDataSource || this._myDataSource.state !== 'success') {
        return
      }
	  

		// Added by HM now:
		console.log("-- render() - _myDataSource is defined!");
		
		// Loop though data:
		for (const d of this._myDataSource.data) {
		
			// Loop through dimensions:
			for (const feedEntry of this._myDataSource.metadata.feeds.dimensions.values) {
				const dimensionEntry = '${d[feedEntry].label}';
				console.log("- DimensionEntry: "+dimensionEntry);
			}
		
			// Loop through measures:
			for (const feedEntry of metadata.feeds.measures.values) {
				const measureLabel = metadata.minStructureMembers[feedEntry].label;
				const measureEntry = '${measureLabel} ${d[feedEntry].raw || d[feedEntry].formatted}';
				console.log("- measureLabel: "+measureLabel+", measureEntry: "+measureEntry);
			}
		}

   
      const dimension = this._myDataSource.metadata.feeds.dimensions.values[0]
      const measure = this._myDataSource.metadata.feeds.measures.values[0]
      const data = this._myDataSource.data.map(data => {
        return {
          name: data[dimension].label,
          value: data[measure].raw
        }
      })

      const myChart = echarts.init(this._root, 'wight')
      const option = {
/*		   title: {
			text: 'Customized Pie',
			left: 'center',
			top: 20,
			textStyle: {
			  color: '#000'
			}
		  },
*/
       tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '2%',
          left: 'center'
        },
        series: [
          {
            name: '',
            type: 'pie',
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 4
            },
            label: {
              show: true,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '25',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: true
            },
            data
          }
        ]
      }
      myChart.setOption(option)
	
    }
  }

  customElements.define('com-sap-sample-evonik-pie_chart', EvonikPieChart)
})()
