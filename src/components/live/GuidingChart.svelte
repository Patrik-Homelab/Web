<script lang="ts">
  import type { GuideHistoryPoint } from '$/lib/server/nina';
  import { getState } from '$/lib/state.svelte';
  import { Chart } from 'chart.js/auto';
  import { onMount } from 'svelte';

  interface Props {
    history: GuideHistoryPoint[];
  }

  const { history }: Props = $props();
  const _state = getState();
  const chartLang = $derived(_state.lang.live_photo.guiding_chart);

  let canvas = $state<HTMLCanvasElement | null>(null);
  let chartInstance: Chart<'line'> | null = null;

  function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  onMount(() => {
    if (!canvas) return;
    chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels: history.map((p) => formatTime(p.timestamp)),
        datasets: [
          {
            label: chartLang.ra,
            data: history.map((p) => Number(p.ra.toFixed(2))),
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            borderWidth: 1.8,
            pointRadius: 2,
            tension: 0.3
          },
          {
            label: chartLang.dec,
            data: history.map((p) => Number(p.dec.toFixed(2))),
            borderColor: '#fb7185',
            backgroundColor: 'rgba(251, 113, 133, 0.12)',
            borderWidth: 1.8,
            pointRadius: 2,
            tension: 0.3
          },
          {
            label: chartLang.total,
            data: history.map((p) => Number(p.total.toFixed(2))),
            borderColor: '#f75b00',
            backgroundColor: 'rgba(247, 91, 0, 0.14)',
            borderWidth: 2.4,
            pointRadius: 2.5,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#cbd5e1',
              boxWidth: 12,
              font: { size: 11, weight: 'bold' }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}″`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8', maxTicksLimit: 6, font: { size: 10 } },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#94a3b8',
              font: { size: 10 },
              callback: (val) => `${val}″`
            },
            grid: { color: 'rgba(255, 255, 255, 0.06)' }
          }
        }
      }
    });

    return () => {
      chartInstance?.destroy();
      chartInstance = null;
    };
  });

  $effect(() => {
    if (!chartInstance) return;
    chartInstance.data.labels = history.map((p) => formatTime(p.timestamp));
    chartInstance.data.datasets[0].label = chartLang.ra;
    chartInstance.data.datasets[0].data = history.map((p) => Number(p.ra.toFixed(2)));
    chartInstance.data.datasets[1].label = chartLang.dec;
    chartInstance.data.datasets[1].data = history.map((p) => Number(p.dec.toFixed(2)));
    chartInstance.data.datasets[2].label = chartLang.total;
    chartInstance.data.datasets[2].data = history.map((p) => Number(p.total.toFixed(2)));
    chartInstance.update('none');
  });
</script>

<div class="relative h-56 w-full">
  <canvas bind:this={canvas}></canvas>
</div>
