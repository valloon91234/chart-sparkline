// Create the ChartTooltip component
function ChartTooltip(config) {
    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.display = 'none';
    tooltip.style.backgroundColor = config.theme === 'dark' ? '#101828' : '#fff';
    tooltip.style.borderRadius = '8px';
    tooltip.style.padding = '12px';
    tooltip.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    tooltip.style.fontFamily = 'Arial, sans-serif';
    tooltip.style.fontSize = '12px';
    tooltip.style.color = config.theme === 'dark' ? '#fff' : '#667085';
    tooltip.style.zIndex = '9999';
  
    const labelElement = document.createElement('div');
    labelElement.className = 'chart-tooltip-label';
    labelElement.style.marginBottom = '4px';
    tooltip.appendChild(labelElement);
  
    const valueElement = document.createElement('div');
    valueElement.className = 'chart-tooltip-value';
    tooltip.appendChild(valueElement);
  
    document.body.appendChild(tooltip);
  
    return {
      update: (data) => {
        if (data.display) {
          tooltip.style.display = 'block';
          tooltip.style.left = `${data.position.x}px`;
          tooltip.style.top = `${data.position.y}px`;

          if (data.prepend == null) data.prepend = '';
          if (data.append == null) data.append = '';
  
          labelElement.textContent = data.label;
          var values = '';
          data.value.forEach(element => {
            values += element + '<br>'; 
          });
          valueElement.innerHTML = `${data.prepend}${values}${data.append}`;
        } else {
          tooltip.style.display = 'none';
        }
      },
    };
  }