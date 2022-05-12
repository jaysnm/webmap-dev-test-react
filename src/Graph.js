import Plot from 'react-plotly.js'

const prepareData = (data) => {
    let trace = {
        date: [],
        alert: [],
        full_recovery: [],
        no_data: [],
        partial_recovery: [],
        warning: [],
        watch: []
    }
    for (let i = 0; i < data.length; i++) {
        trace.date.push(data[i].date);
        trace.alert.push(data[i].alert);
        trace.full_recovery.push(data[i].full_recovery);
        trace.no_data.push(data[i].no_data);
        trace.partial_recovery.push(data[i].partial_recovery);
        trace.warning.push(data[i].warning);
        trace.watch.push(data[i].watch);

    }
    return trace
}

const graphTraces = (data) => {
    return [{
        x: data.date,
        y: data.no_data,
        type: 'bar',
        name: 'No Drought',
        marker: {
            color: '#f8f8f8'
        }
    }, {
        x: data.date,
        y: data.full_recovery,
        type: 'bar',
        name: 'Full Recovery',
        marker: {
            color: '#9dc75f'
        }
    }, {
        x: data.date,
        y: data.partial_recovery,
        type: 'bar',
        name: 'Partial Recovery',
        marker: {
            color: '#a08002'
        }
    }, {
        x: data.date,
        y: data.watch,
        type: 'bar',
        name: 'Watch',
        marker: {
            color: '#ffff04'
        }
    }, {
        x: data.date,
        y: data.warning,
        type: 'bar',
        name: 'Warning',
        marker: {
            color: '#ffa601'
        }
    }, {
        x: data.date,
        y: data.alert,
        type: 'bar',
        name: 'Alert',
        marker: {
            color: '#ff0000'
        }
    }]
}

const graphLayout = () => {
    return {
        font: {
            family: 'Raleway, sans-serif'
        },
        title: 'Clicked Area Analysis Graph!',
        xaxis: {
            title: "Date"
        },
        yaxis: {
            title: "% of whole region"
        },
        barmode: 'stack',
        bargap: 0.05
    }
}

const Graph = ({ data }) => {
    let prepData = prepareData(data)
    let traces = graphTraces(prepData)
    let layout = graphLayout()
    let style = { position: 'relative', display: 'inline-block', width: '520px' }
    return ( <
        Plot data = { traces }
        layout = { layout }
        style = { style }
        />
    )
}

export default Graph;