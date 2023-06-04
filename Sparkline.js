
function Sparkline(targetElement, config) {
    const defaultSparklineConfig = {
        type: 'sparkline',
        hover: 'vertical',
        tooltip: {
            display: true,
            label: true,
            theme: 'light',
            prepend: '',
            append: '',
        },
        chart: {
            lineStyle: 'direct',
            dotDisplay: 'hover',
            gradientFill: true,
        },
        scales: {
            y: {
                min: null,
                max: null,
                suggestedMin: null,
                suggestedMax: null,
            },
        },
        data: {
            labels: [],
            datasets: [[]],
            legends: [''],
            colors: ['#7F56D9', '#9E77ED', '#B692F6', '#D6BBFB', '#E9D7FE', '#EAECF0'],
        },
    };

    const mergedConfig = Object.assign({}, defaultSparklineConfig, config);

    const canvas = document.createElement('canvas');
    canvas.width = targetElement.clientWidth;
    canvas.height = targetElement.clientHeight;
    targetElement.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Calculate the range of the data
    const min = mergedConfig.scales.y.min == null ? Math.min(...mergedConfig.data.datasets.flat()) : mergedConfig.scales.y.min;
    const max = mergedConfig.scales.y.max == null ? Math.max(...mergedConfig.data.datasets.flat()) : mergedConfig.scales.y.max;
    const padding = { top: 20, right: 20, bottom: 50, left: 50 };

    function drawAxios() {
        ctx.beginPath();
        ctx.color = '#000';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#000';

        ctx.moveTo(padding.left, canvas.height - padding.bottom);
        ctx.lineTo(canvas.width - padding.right, canvas.height - padding.bottom);
        ctx.moveTo(padding.left, canvas.height - padding.bottom);
        ctx.lineTo(padding.left, padding.top);
        ctx.stroke();

        mergedConfig.data.labels.forEach((label, index) => {
            ctx.fillText(label, (canvas.width - (padding.left + padding.right)) / (mergedConfig.data.labels.length - 1) * index + 40, canvas.height - 30);
        });

        var maxStrlen = ('' + max).length;
        var minStrlen = ('' + min).length;

        ctx.fillText(min, 40 - minStrlen * 5, canvas.height - 50);
        ctx.fillText(max, 40 - maxStrlen * 5, 30);
        ctx.closePath();
    }

    function drawDot(x, y, color) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = color;
        // ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.closePath();
        ctx.globalAlpha = 1;
    }

    function drawGradients() {
        mergedConfig.data.datasets.forEach((dataset, datasetIndex) => {
            const color = mergedConfig.data.colors[datasetIndex % mergedConfig.data.colors.length];

            ctx.beginPath();

            dataset.forEach((value, index) => {
                const { x, y } = calculatePosition(index, value);

                if (mergedConfig.chart.lineStyle === 'waves') {
                    const previousX = (index > 0) ? calculatePosition(index - 1, dataset[index - 1]).x : padding.left;
                    const previousY = (index > 0) ? calculatePosition(index - 1, dataset[index - 1]).y : y;
                    const controlPointX = (previousX + x) / 2;
                    ctx.bezierCurveTo(controlPointX, previousY, controlPointX, y, x, y);
                } else if (mergedConfig.chart.lineStyle === 'smooth') {
                    const previousX = (index > 0) ? calculatePosition(index - 1, dataset[index - 1]).x : padding.left;
                    const previousY = (index > 0) ? calculatePosition(index - 1, dataset[index - 1]).y : y;
                    const controlPointX = (previousX + x) / 2;
                    ctx.quadraticCurveTo(controlPointX, previousY, x, y);
                } else {
                    ctx.lineTo(x, y);
                }

            });
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.lineTo(canvas.width - 20, canvas.height - 50);
            ctx.lineTo(50, canvas.height - 50);
            ctx.closePath();
            ctx.fillStyle = gradient;
            ctx.fill();

        });
    }

    function drawLines() {
        mergedConfig.data.datasets.forEach((dataset, datasetIndex) => {
            const color = mergedConfig.data.colors[datasetIndex % mergedConfig.data.colors.length];

            ctx.beginPath();

            dataset.forEach((value, index) => {
                const { x, y } = calculatePosition(index, value);

                if (mergedConfig.chart.lineStyle === 'waves') {
                    const previousX = (index > 0) ? calculatePosition(index - 1, dataset[index - 1]).x : padding.left;
                    const previousY = (index > 0) ? calculatePosition(index - 1, dataset[index - 1]).y : y;
                    const controlPointX = (previousX + x) / 2;
                    ctx.bezierCurveTo(controlPointX, previousY, controlPointX, y, x, y);
                } else if (mergedConfig.chart.lineStyle === 'smooth') {
                    const previousX = (index > 0) ? calculatePosition(index - 1, dataset[index - 1]).x : padding.left;
                    const previousY = (index > 0) ? calculatePosition(index - 1, dataset[index - 1]).y : y;
                    const controlPointX = (previousX + x) / 2;
                    ctx.quadraticCurveTo(controlPointX, previousY, x, y);
                } else {
                    ctx.lineTo(x, y);
                }

            });

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();

        });
    }

    function drawDots() {

        mergedConfig.data.datasets.forEach((dataset, datasetIndex) => {
            const color = mergedConfig.data.colors[datasetIndex % mergedConfig.data.colors.length];

            ctx.beginPath();

            dataset.forEach((value, index) => {
                const { x, y } = calculatePosition(index, value);

                if (mergedConfig.chart.dotDisplay == 'all') {
                    drawDot(x, y, color);
                }
            });
        });

        ctx.globalAlpha = 1;

    }

    // Calculate the pixel position for a given data point
    function calculatePosition(index, value) {
        const x = ((canvas.width - (padding.left + padding.right)) / (mergedConfig.data.labels.length - 1)) * index + 50;
        const y = canvas.height - 50 - (((canvas.height - (padding.top + padding.bottom)) / (max - min)) * (value - min));
        return { x, y };
    }

    function calculateAvg(index) {

        var sum = 0;

        mergedConfig.data.datasets.forEach(dataset => {
            sum += dataset[index];
        });

        return sum/mergedConfig.data.datasets.length;
    }

    // Draw the sparkline chart
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.textBaseline = 'middle';
        ctx.font = '12px Arial';

        drawAxios();

        (mergedConfig.chart.gradientFill || mergedConfig.chart.lineStyle == 'waves') && drawGradients();

        mergedConfig.chart.lineStyle != 'waves' && drawLines();

        mergedConfig.chart.dotDisplay == 'all' && drawDots();

    }

    if (mergedConfig.tooltip.display) {
        let activeTooltip = null; // Initialize active tooltip

        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const dataPointsCount = mergedConfig.data.labels.length;
            const dataPointWidth = (canvas.width - (padding.left + padding.right)) / (dataPointsCount - 1);
            const dataIndex = Math.round((x - padding.left) / dataPointWidth);

            if (dataIndex >= 0 && dataIndex < dataPointsCount) {
                const labels = mergedConfig.data.datasets.map((dataset, index) => {
                    const value = dataset[dataIndex];
                    const color = mergedConfig.data.colors[index];
                    const legend = mergedConfig.data.legends[color ? mergedConfig.data.colors.indexOf(color) : 0];
                    const formattedValue = `${mergedConfig.tooltip.prepend || ""}${value.toLocaleString("en-US")}${mergedConfig.tooltip.append || ""}`;
                    return { legend, value: formattedValue, color };
                    // return { value, color };
                });
                const tooltipLabel = mergedConfig.data.labels[dataIndex];

                // Update active tooltip if necessary
                if (!activeTooltip || activeTooltip.index !== dataIndex) {
                    // Clear canvas and redraw the chart
                    drawChart();

                    // Draw tooltip
                    ctx.fillStyle = mergedConfig.tooltip.theme === 'dark' ? '#101828' : '#FFF';

                    const tooltipPadding = 12;
                    const circleRadius = 4;
                    const circleMarginRight = 6;
                    const maxLabelWidth = mergedConfig.tooltip.label ? 
                            Math.max(...labels.map((label) => ctx.measureText(label.legend + " : " + label.value).width + circleRadius * 2 + circleMarginRight)) : 
                            Math.max(...labels.map((label) => ctx.measureText(label.value).width + circleRadius * 2 + circleMarginRight));
                    const labelHeight = parseInt(ctx.font, 10);
                    const tooltipWidth = maxLabelWidth + tooltipPadding * 2 + 2;
                    const tooltipHeight = (labels.length) * (labelHeight + 5) + tooltipPadding * 2 + 5;

                    let tooltipX = dataIndex * dataPointWidth + padding.left;
                    let tooltipY = canvas.height - 60 - (Math.max(...mergedConfig.data.datasets.map(data => data[dataIndex])) - min) * ((canvas.height - (padding.top + padding.bottom)) / (max - min));

                    // Draw tooltip box
                    let trianglePosition = "bottom";
                    let tooltipBoxX = tooltipX - tooltipWidth / 2;
                    let tooltipBoxY = tooltipY - tooltipHeight - 10;
                    if (tooltipX < 60) {
                        trianglePosition = "left";
                        tooltipY = canvas.height - 60 - (calculateAvg(dataIndex) - min) * ((canvas.height - 70) / (max - min));
                        
                        tooltipBoxX = tooltipX + 15;
                        tooltipBoxY = tooltipY - tooltipHeight / 2 + 10;
                    } else if (tooltipBoxX < 60) {
                        tooltipBoxX = 60;
                    } else if (tooltipX > rect.width - 30) {
                        trianglePosition = "right";
                        tooltipY = canvas.height - 60 - (calculateAvg(dataIndex) - min) * ((canvas.height - 70) / (max - min));
                        tooltipBoxX = rect.width - tooltipWidth - 34;
                        tooltipBoxY = tooltipY - tooltipHeight / 2 + 10;
                    } else if (tooltipBoxX + tooltipWidth > rect.width - 10) {
                        tooltipBoxX = rect.width - tooltipWidth - 20;
                    }

                    activeTooltip = {
                        index: dataIndex,
                        // x: tooltipX,
                        // y: tooltipY,
                        // // values: tooltipValues,
                        // label: tooltipLabel
                    };

                    const shadowBlur = 20;
                    const shadowOffsetX = 0;
                    const shadowOffsetY = 4;
                    const shadowColor = 'rgba(0, 0, 0, 0.2)';
                    const cornerRadius = 10;

                    ctx.shadowColor = shadowColor;
                    ctx.shadowBlur = shadowBlur;
                    ctx.shadowOffsetX = shadowOffsetX;
                    ctx.shadowOffsetY = shadowOffsetY;

                    // ctx.fillStyle = mergedConfig.tooltip.theme === 'dark' ? '#101828' : '#fff';
                    ctx.beginPath();
                    ctx.moveTo(tooltipBoxX + cornerRadius, tooltipBoxY);
                    ctx.lineTo(tooltipBoxX + tooltipWidth - cornerRadius, tooltipBoxY);
                    ctx.quadraticCurveTo(tooltipBoxX + tooltipWidth, tooltipBoxY, tooltipBoxX + tooltipWidth, tooltipBoxY + cornerRadius);
                    ctx.lineTo(tooltipBoxX + tooltipWidth, tooltipBoxY + tooltipHeight - cornerRadius);
                    ctx.quadraticCurveTo(tooltipBoxX + tooltipWidth, tooltipBoxY + tooltipHeight, tooltipBoxX + tooltipWidth - cornerRadius, tooltipBoxY + tooltipHeight);
                    ctx.lineTo(tooltipBoxX + cornerRadius, tooltipBoxY + tooltipHeight);
                    ctx.quadraticCurveTo(tooltipBoxX, tooltipBoxY + tooltipHeight, tooltipBoxX, tooltipBoxY + tooltipHeight - cornerRadius);
                    ctx.lineTo(tooltipBoxX, tooltipBoxY + cornerRadius);
                    ctx.quadraticCurveTo(tooltipBoxX, tooltipBoxY, tooltipBoxX + cornerRadius, tooltipBoxY);
                    ctx.closePath();
                    ctx.fill();

                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;

                    // Draw triangle indicator
                    if (trianglePosition == "left") {
                        ctx.beginPath();
                        ctx.moveTo(tooltipBoxX - 6, tooltipY + 10);
                        ctx.lineTo(tooltipBoxX, tooltipY + 10 - 7);
                        ctx.lineTo(tooltipBoxX, tooltipY + 10 + 7);
                        ctx.closePath();
                        // ctx.fillStyle = mergedConfig.tooltip.theme === 'dark' ? '#101828' : '#fff';
                        ctx.fill();
                    } else if (trianglePosition == "right") {
                        ctx.beginPath();
                        ctx.moveTo(tooltipBoxX + tooltipWidth + 6, tooltipY + 10);
                        ctx.lineTo(tooltipBoxX + tooltipWidth, tooltipY + 10 - 7);
                        ctx.lineTo(tooltipBoxX + tooltipWidth, tooltipY + 10 + 7);
                        ctx.closePath();
                        // ctx.fillStyle = mergedConfig.tooltip.theme === 'dark' ? '#101828' : '#fff';
                        ctx.fill();
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(tooltipX - 7, tooltipY - 11);
                        ctx.lineTo(tooltipX + 7, tooltipY - 11);
                        ctx.lineTo(tooltipX, tooltipY - 4);
                        ctx.closePath();
                        // ctx.fillStyle = mergedConfig.tooltip.theme === 'dark' ? '#101828' : '#fff';
                        ctx.fill();
                    }

                    // Draw tooltip text
                    ctx.textAlign = 'left';

                    // ctx.fillStyle = mergedConfig.tooltip.theme === 'dark' ? '#fff' : '#101828';
                    // ctx.fillText("This is a tooltip", tooltipBoxX + tooltipPadding, tooltipBoxY+10 + tooltipPadding);

                    labels.forEach(({ legend, value, color }, index) => {
                        const labelX = tooltipBoxX + tooltipPadding + circleRadius * 2;
                        const labelY = tooltipBoxY + 10 + tooltipPadding + (index) * (labelHeight + 10);

                        // Draw colored circle
                        ctx.beginPath();
                        ctx.arc(tooltipBoxX + tooltipPadding + circleRadius, labelY, circleRadius, 0, 2 * Math.PI);
                        ctx.fillStyle = color || '#101828';
                        ctx.fill();

                        // Draw tooltip text
                        ctx.fillStyle = mergedConfig.tooltip.theme === 'dark' ? '#FFF' : '#101828';
                        ctx.fillText(mergedConfig.tooltip.label ? (legend + " : " + value) : value, labelX + circleMarginRight, labelY);
                        ctx.closePath();
                    });

                    if (mergedConfig.chart.dotDisplay == "hover") {
                        labels.forEach(({ legend, value, color }, index) => {
                            const dotX = dataIndex * dataPointWidth + padding.left;
                            const dotY = canvas.height - padding.bottom - (mergedConfig.data.datasets[index][dataIndex] - min) * ((canvas.height - (padding.bottom + padding.top)) / (max - min));
                            drawDot(dotX, dotY, color);
                        });
                    }


                }
            } else {
                // Clear canvas and redraw the chart when the mouse is not over a data point
                if (activeTooltip) {
                    activeTooltip = null; // Reset active tooltip
                    drawChart();
                }
            }
        });

        canvas.addEventListener('mouseout', () => {
            // Clear canvas and redraw the chart when the mouse moves out of the canvas area
            if (activeTooltip) {
                activeTooltip = null; // Reset active tooltip
                drawChart();
            }
        });
    }

    // Redraw the chart when the window is resized
    window.addEventListener('resize', () => {
        canvas.width = targetElement.clientWidth;
        canvas.height = targetElement.clientHeight;
        drawChart();
    });

    // Initial chart rendering
    drawChart();

}


