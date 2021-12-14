<script>
    import Highcharts from 'highcharts'
    import Data from "highcharts/modules/data";
    import { afterUpdate } from 'svelte';

    let completion;
    Data(Highcharts);

    afterUpdate(() => {
        async function handle() {
            const res = await fetch('http://144.91.113.190/result.csv')
            const lines = (await res.text()).split(/\r?\n/);
            let codePct = [];
            let dataPct = [];

            for (var line of lines) {
                const values = line.split(',')

                if (values.length !== 6)
                    continue;

                codePct.push({
                    x: parseFloat(values[1]) * 1000,
                    y: parseFloat(values[2]) * 100 /* Percent */,
                    commitId: values[0],
                    trophies: values[4],
                    events: values[5]
                })
                dataPct.push({
                    x: parseFloat(values[1] * 1000),
                    y: parseFloat(values[3] * 100 /* Percent */),
                    commitId: values[0],
                    trophies: values[4],
                    events: values[5]
                })
            }

            completion = codePct[codePct.length - 1].y
            Highcharts.chart('container', {
                chart: {
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift'
                },
                title: {
                    text: 'Melee Decompilation Progress History'
                },
                subtitle: {
                    text: 'SSBM 1.02 NTSC'
                },
                tooltip: {
                    valueDecimals: 2,
                    style: {
                        pointerEvents: 'auto'
                    },
                    formatter: function() {
                        return "<b>Commit ID:</b> <a target=\"_blank\"href=\"https://github.com/doldecomp/melee/commit/" + this.point.commitId + "\">" + this.point.commitId + 
                            "</a><br><b>Trophies cleared</b>: " + this.point.trophies +
                            "<br><b>Events cleared:</b> " + this.point.events
                    }
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    labels: {
                        format: '{value}%'
                    }
                },
                series: [{
                    name: "Code percentage completed",
                    data: codePct,
                    lineWidth: 1
                }, {
                    name: "Data percentage completed",
                    data: dataPct,
                    lineWidth: 1
                }]
            });

            return codePct[codePct.length - 1].y;
        }

        handle().then((val) => completion = val);
    })

    function getPercentage(value) {
        return value + "%";
    }
</script>

{#if completion}
    <div style="width: 100%; display: flex; justify-content: center;">
        <div id="progressbar">
            <div style={"width: " + getPercentage(completion)} />
        </div>
    </div>
    <div class="title">{getPercentage(Math.floor(completion * 100) / 100)} completed!</div>
{/if}
<div id="container" style="height: 400px; max-width: 800px; margin: 0 auto; margin-top: 50px;" />

<style>
    .title {
        color: white;
        font-size: 32px;
    }

    #progressbar {
        width: 50%;
        text-align: center;
        background-color: gray;
        border-radius: 13px;
        /* (height of inner div) / 2 + padding */
        padding: 3px;
    }

    #progressbar>div {
        background-color: yellow;
        height: 20px;
        border-radius: 10px;
    }
</style>
