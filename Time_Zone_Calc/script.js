let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let sourceDate = null;
let targetDate = null;
let isPM = false; // Track AM/PM state

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

// Set default time in 12-hour format
let currentHours = now.getHours();
let displayHours = currentHours % 12 || 12;
const currentMinutes = now.getMinutes().toString().padStart(2, '0');
const ampm = currentHours >= 12 ? 'PM' : 'AM';

// Set the time input value
document.getElementById('sourceTime').value = `${displayHours.toString().padStart(2, '0')}:${currentMinutes}`;

// Set initial AM/PM state and button text
isPM = (ampm === 'PM');
updateAmPmButton();

function updateAmPmButton() {
    const ampmButton = document.getElementById('ampmToggle');
    ampmButton.textContent = isPM ? 'PM' : 'AM';
    ampmButton.className = isPM ? 'ampm-toggle active' : 'ampm-toggle';
}

function toggleAmPm() {
    isPM = !isPM;
    updateAmPmButton();
    convertTimezone();
}

function convertTimezone() {
    const sourceTz = document.getElementById('sourceTimezone').value;
    const targetTz = document.getElementById('targetTimezone').value;
    const date = document.getElementById('sourceDate').value;
    const time = document.getElementById('sourceTime').value;

    if (!date || !time) return;

    // Parse source date and time
    const [year, month, day] = date.split('-').map(Number);
    const [hoursStr, minutesStr] = time.split(':');
    
    // Convert to 24-hour format based on AM/PM
    let hours = parseInt(hoursStr);
    const minutes = parseInt(minutesStr);
    
    // Handle 12-hour format conversion
    if (isPM && hours < 12) {
        hours += 12;
    } else if (!isPM && hours === 12) {
        hours = 0;
    }
    
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
    
    // Format target time in 12-hour format
    const targetAmPm = targetHours >= 12 ? 'PM' : 'AM';
    const targetDisplayHours = targetHours % 12 || 12;
    const targetDisplayMinutes = minutes.toString().padStart(2, '0');
    
    // Format target date
    const targetFormatted = `${getWeekday(targetDateObj)}, ${getMonthName(targetDateObj)} ${targetDateObj.getDate()}, ${targetDateObj.getFullYear()}, ${targetDisplayHours}:${targetDisplayMinutes} ${targetAmPm}`;
    
    // Format source date for display
    const sourceDateObj = new Date(year, month - 1, day);
    const sourceDisplayHours = hours % 12 || 12;
    const sourceAmPm = hours >= 12 ? 'PM' : 'AM';
    const sourceFormatted = `${getWeekday(sourceDateObj)}, ${getMonthName(sourceDateObj)} ${sourceDateObj.getDate()}, ${sourceDateObj.getFullYear()}, ${sourceDisplayHours}:${targetDisplayMinutes} ${sourceAmPm}`;
    
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
    
    // If we have a calculated result, use the target date and time as the new source
    if (targetDate) {
        // Format target date for input
        const targetYear = targetDate.getFullYear();
        const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
        const targetDay = String(targetDate.getDate()).padStart(2, '0');
        
        // Get the current displayed time values
        const currentTime = document.getElementById('sourceTime').value;
        const [currentHoursStr, currentMinutesStr] = currentTime.split(':');
        
        // Get timezone offsets for calculation
        const originalSourceOffset = timezoneOffsets[sourceTz];
        const originalTargetOffset = timezoneOffsets[targetTz];
        
        // Convert current displayed time to 24-hour format for calculation
        let currentHours24 = parseInt(currentHoursStr);
        if (isPM && currentHours24 < 12) {
            currentHours24 += 12;
        } else if (!isPM && currentHours24 === 12) {
            currentHours24 = 0;
        }
        
        // Calculate what the target time would be in 24-hour format
        const timeDifference = originalTargetOffset - originalSourceOffset;
        let targetHours24 = currentHours24 + timeDifference;
        
        // Handle day overflow/underflow for time calculation
        if (targetHours24 >= 24) {
            targetHours24 -= 24;
        } else if (targetHours24 < 0) {
            targetHours24 += 24;
        }
        
        // Convert the target time back to 12-hour format for display
        const newDisplayHours = targetHours24 % 12 || 12;
        const newTimeFormatted = String(newDisplayHours).padStart(2, '0') + ':' + currentMinutesStr;
        
        // Update AM/PM state based on the target time
        const newIsPM = (targetHours24 >= 12);
        
        // Update all inputs to match the target values
        document.getElementById('sourceTime').value = newTimeFormatted;
        document.getElementById('sourceDate').value = `${targetYear}-${targetMonth}-${targetDay}`;
        
        // Update AM/PM state and button
        isPM = newIsPM;
        updateAmPmButton();
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
document.getElementById('ampmToggle').addEventListener('click', toggleAmPm);

// Initial render
renderCalendar();
convertTimezone();