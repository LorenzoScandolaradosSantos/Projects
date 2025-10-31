let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let sourceDate = null;
let targetDate = null;

// Timezone offset mapping (in hours)
const timezoneOffsets = {
    'America/New_York': -4,
    'Pacific/Honolulu': -10,
    'America/Anchorage': -8,
    'America/Los_Angeles': -7,
    'America/Denver': -6,
    'America/Chicago': -5,
    'America/Sao_Paulo': -3,
    'Atlantic/Azores': -1,
    'Europe/London': 0,
    'Europe/Paris': 2,
    'Europe/Berlin': 2,
    'Africa/Cairo': 2,
    'Europe/Moscow': 3,
    'Asia/Dubai': 4,
    'Asia/Karachi': 5,
    'Asia/Dhaka': 6,
    'Asia/Bangkok': 7,
    'Asia/Shanghai': 8,
    'Asia/Tokyo': 9,
    'Australia/Darwin': 9.5,
    'Australia/Sydney': 11,
    'Pacific/Auckland': 13
};

// Set default date and time to now
const now = new Date();
document.getElementById('sourceDate').valueAsDate = now;
document.getElementById('sourceTime').value = now.toTimeString().slice(0, 5);

function convertTimezone() {
    const sourceTz = document.getElementById('sourceTimezone').value;
    const targetTz = document.getElementById('targetTimezone').value;
    const date = document.getElementById('sourceDate').value;
    const time = document.getElementById('sourceTime').value;

    if (!date || !time) return;

    // Parse source date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    
    // Get timezone offsets
    const sourceOffset = timezoneOffsets[sourceTz];
    const targetOffset = timezoneOffsets[targetTz];
    
    // Calculate time difference
    const timeDifference = targetOffset - sourceOffset;
    
    // Calculate target time
    let targetHours = hours + timeDifference;
    let targetDateObj = new Date(year, month - 1, day);
    
    // Handle day changes
    if (targetHours >= 24) {
        targetHours -= 24;
        targetDateObj.setDate(targetDateObj.getDate() + 1);
    } else if (targetHours < 0) {
        targetHours += 24;
        targetDateObj.setDate(targetDateObj.getDate() - 1);
    }
    
    // Format target time
    const ampm = targetHours >= 12 ? 'PM' : 'AM';
    const displayHours = targetHours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    // Format target date
    const targetFormatted = `${getWeekday(targetDateObj)}, ${getMonthName(targetDateObj)} ${targetDateObj.getDate()}, ${targetDateObj.getFullYear()}, ${displayHours}:${displayMinutes} ${ampm}`;
    
    // Format source date for display
    const sourceDateObj = new Date(year, month - 1, day);
    const sourceFormatted = `${getWeekday(sourceDateObj)}, ${getMonthName(sourceDateObj)} ${sourceDateObj.getDate()}, ${sourceDateObj.getFullYear()}, ${formatTime(hours, minutes)}`;
    
    // Calculate hour difference for display
    const hourDifference = timeDifference;
    
    // Set calendar dates
    sourceDate = sourceDateObj;
    targetDate = targetDateObj;

    // Display the result
    const resultHTML = `
        <div style="text-align: center; line-height: 1.4;">
            <div style="font-size: 1.1em; margin-bottom: 8px;"><strong>${targetFormatted}</strong></div>
        </div>
    `;

    document.getElementById('result').innerHTML = resultHTML;
    renderCalendar();
}

function formatTime(hours, minutes) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
}

function getWeekday(date) {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays[date.getDay()];
}

function getMonthName(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
}

function formatHourDifference(hours) {
    if (hours === 0) return "Same time";
    const absHours = Math.abs(hours);
    const hourText = absHours === 1 ? "hour" : "hours";
    const direction = hours > 0 ? "ahead" : "behind";
    return `${absHours} ${hourText} ${direction}`;
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    
    document.getElementById('calendarTitle').textContent = 
        `${monthNames[currentMonth]} ${currentYear}`;

    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendar.appendChild(header);
    });

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day empty';
        calendar.appendChild(empty);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.textContent = day;

        const cellDate = new Date(currentYear, currentMonth, day);
        
        let isSource = false;
        let isTarget = false;

        if (sourceDate && 
            cellDate.getDate() === sourceDate.getDate() &&
            cellDate.getMonth() === sourceDate.getMonth() &&
            cellDate.getFullYear() === sourceDate.getFullYear()) {
            isSource = true;
        }

        if (targetDate && 
            cellDate.getDate() === targetDate.getDate() &&
            cellDate.getMonth() === targetDate.getMonth() &&
            cellDate.getFullYear() === targetDate.getFullYear()) {
            isTarget = true;
        }

        if (isSource && isTarget) {
            dayCell.className += ' both-dates';
        } else if (isSource) {
            dayCell.className += ' source-date';
        } else if (isTarget) {
            dayCell.className += ' target-date';
        }

        calendar.appendChild(dayCell);
    }
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function invertCalculation() {
    const sourceTz = document.getElementById('sourceTimezone').value;
    const targetTz = document.getElementById('targetTimezone').value;
    
    // Swap timezones
    document.getElementById('sourceTimezone').value = targetTz;
    document.getElementById('targetTimezone').value = sourceTz;
    
    // If we have a calculated result, use the target time as the new source time
    if (targetDate) {
        // Get the target date components directly
        const targetYear = targetDate.getFullYear();
        const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
        const targetDay = String(targetDate.getDate()).padStart(2, '0');
        
        // Get the target time by recalculating it
        const originalTime = document.getElementById('sourceTime').value;
        const originalDate = document.getElementById('sourceDate').value;
        const [year, month, day] = originalDate.split('-').map(Number);
        const [originalHours, originalMinutes] = originalTime.split(':').map(Number);
        
        // Get timezone offsets
        const originalSourceOffset = timezoneOffsets[sourceTz];
        const originalTargetOffset = timezoneOffsets[targetTz];
        
        // Calculate the target time
        const timeDifference = originalTargetOffset - originalSourceOffset;
        let targetHours = originalHours + timeDifference;
        
        // Handle day overflow/underflow
        if (targetHours >= 24) {
            targetHours -= 24;
        } else if (targetHours < 0) {
            targetHours += 24;
        }
        
        // Format the new time for input
        const newTimeFormatted = String(targetHours).padStart(2, '0') + ':' + 
                               String(originalMinutes).padStart(2, '0');
        
        // Update the inputs with target date and time
        document.getElementById('sourceTime').value = newTimeFormatted;
        document.getElementById('sourceDate').value = `${targetYear}-${targetMonth}-${targetDay}`;
    }
    
    // Recalculate with the swapped timezones
    convertTimezone();
}

// Event listeners
document.getElementById('sourceTimezone').addEventListener('change', convertTimezone);
document.getElementById('targetTimezone').addEventListener('change', convertTimezone);
document.getElementById('sourceDate').addEventListener('change', convertTimezone);
document.getElementById('sourceTime').addEventListener('change', convertTimezone);
document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
document.getElementById('invertBtn').addEventListener('click', invertCalculation);

// Initial render
renderCalendar();
convertTimezone();