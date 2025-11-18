// Store the calculated hourly rate and hours per week
let currentHourlyRate = 0;
let currentHoursPerWeek = 40;
const WEEKS_PER_YEAR = 52; // Standard average
const MONTHS_PER_YEAR = 12; // Standard average

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hours per week value
    const hoursPerWeekInput = document.getElementById('hoursPerWeek');
    currentHoursPerWeek = parseFloat(hoursPerWeekInput.value) || 40;
    
    // Auto-calculate work time when target amount changes
    document.getElementById('targetAmount').addEventListener('input', calculateWorkTime);
    document.getElementById('detailedTargetAmount').addEventListener('input', calculateDetailedWorkTime);
    
    // Auto-calculate hourly rate when any input changes in the first section
    document.getElementById('salaryAmount').addEventListener('input', calculateHourlyRate);
    document.getElementById('hoursPerWeek').addEventListener('input', function() {
        currentHoursPerWeek = parseFloat(this.value) || 40;
        calculateHourlyRate();
    });
    document.getElementById('salaryPeriod').addEventListener('change', calculateHourlyRate);
    
    // Auto-calculate detailed work time when daily hours change
    const dailyInputs = ['mondayHours', 'tuesdayHours', 'wednesdayHours', 'thursdayHours', 'fridayHours', 'saturdayHours', 'sundayHours'];
    dailyInputs.forEach(day => {
        document.getElementById(day).addEventListener('input', calculateDetailedWorkTime);
    });
    
    function calculateHourlyRate() {
        const salaryPeriod = document.getElementById('salaryPeriod').value;
        const salaryAmount = parseFloat(document.getElementById('salaryAmount').value);
        const hoursPerWeek = parseFloat(document.getElementById('hoursPerWeek').value);
        
        if (isNaN(salaryAmount) || isNaN(hoursPerWeek)) {
            document.getElementById('hourlyRateResult').innerHTML = 
                '<span style="color: #ffcccb;">Please enter valid numbers</span>';
            currentHourlyRate = 0;
            updateTargetCalculationStatus();
            updateDetailedTargetCalculationStatus();
            return;
        }
        
        if (salaryAmount <= 0 || hoursPerWeek <= 0) {
            document.getElementById('hourlyRateResult').innerHTML = 
                '<span style="color: #ffcccb;">Values must be greater than 0</span>';
            currentHourlyRate = 0;
            updateTargetCalculationStatus();
            updateDetailedTargetCalculationStatus();
            return;
        }
        
        let hourlyRate;
        
        switch(salaryPeriod) {
            case 'yearly':
                hourlyRate = salaryAmount / (hoursPerWeek * WEEKS_PER_YEAR);
                break;
            case 'monthly':
                hourlyRate = (salaryAmount * 12) / (hoursPerWeek * WEEKS_PER_YEAR);
                break;
            case 'biweekly':
                hourlyRate = (salaryAmount * 26) / (hoursPerWeek * WEEKS_PER_YEAR);
                break;
            case 'weekly':
                hourlyRate = salaryAmount / hoursPerWeek;
                break;
        }
        
        currentHourlyRate = hourlyRate;
        currentHoursPerWeek = hoursPerWeek;
        
        document.getElementById('hourlyRateResult').innerHTML = 
            `<div class="highlight">Your approximate hourly rate is: $${hourlyRate.toFixed(2)}</div>`;
        
        // Update the status in both target sections
        updateTargetCalculationStatus();
        updateDetailedTargetCalculationStatus();
        
        // If there's a target amount, recalculate work time
        const targetAmount = parseFloat(document.getElementById('targetAmount').value);
        if (!isNaN(targetAmount) && targetAmount > 0) {
            calculateWorkTime();
        }
        
        const detailedTargetAmount = parseFloat(document.getElementById('detailedTargetAmount').value);
        if (!isNaN(detailedTargetAmount) && detailedTargetAmount > 0) {
            calculateDetailedWorkTime();
        }
    }
    
    function calculateWorkTime() {
        const targetAmount = parseFloat(document.getElementById('targetAmount').value);
        
        // Check if we have a valid hourly rate
        if (currentHourlyRate <= 0) {
            document.getElementById('workTimeResult').innerHTML = 
                '<span style="color: #ffcccb;">Please calculate your hourly rate first</span>';
            return;
        }
        
        if (isNaN(targetAmount)) {
            document.getElementById('workTimeResult').innerHTML = 
                'Enter target amount to calculate work time';
            return;
        }
        
        if (targetAmount <= 0) {
            document.getElementById('workTimeResult').innerHTML = 
                '<span style="color: #ffcccb;">Target amount must be greater than 0</span>';
            return;
        }
        
        // Calculate hours needed
        const hoursNeeded = targetAmount / currentHourlyRate;
        
        // Calculate days (assuming 8 hours per day)
        const daysNeeded = hoursNeeded / 8;
        
        // Calculate weeks
        const weeksNeeded = hoursNeeded / currentHoursPerWeek;
        
        // Calculate months needed - realistic approach
        const monthsNeeded = weeksNeeded / 4.33;
        
        // Calculate years needed - realistic approach
        const yearsNeeded = weeksNeeded / WEEKS_PER_YEAR;
        
        document.getElementById('workTimeResult').innerHTML = `
            <div class="highlight">$${targetAmount.toFixed(2)} equals:</div>
            <div>${hoursNeeded.toFixed(1)} hours of work</div>
            <div>${daysNeeded.toFixed(1)} days</div>
            <div>${weeksNeeded.toFixed(1)} weeks</div>
            <div>${monthsNeeded.toFixed(1)} months</div>
            <div>${yearsNeeded.toFixed(2)} years</div>
        `;
    }
    
    function calculateDetailedWorkTime() {
        const targetAmount = parseFloat(document.getElementById('detailedTargetAmount').value);
        
        // Check if we have a valid hourly rate
        if (currentHourlyRate <= 0) {
            document.getElementById('detailedWorkTimeResult').innerHTML = 
                '<span style="color: #ffcccb;">Please calculate your hourly rate first</span>';
            return;
        }
        
        if (isNaN(targetAmount)) {
            document.getElementById('detailedWorkTimeResult').innerHTML = 
                'Enter target amount to calculate work time';
            return;
        }
        
        if (targetAmount <= 0) {
            document.getElementById('detailedWorkTimeResult').innerHTML = 
                '<span style="color: #ffcccb;">Target amount must be greater than 0</span>';
            return;
        }
        
        // Get daily hours and calculate weekly total
        const dailyHours = {
            monday: parseFloat(document.getElementById('mondayHours').value) || 0,
            tuesday: parseFloat(document.getElementById('tuesdayHours').value) || 0,
            wednesday: parseFloat(document.getElementById('wednesdayHours').value) || 0,
            thursday: parseFloat(document.getElementById('thursdayHours').value) || 0,
            friday: parseFloat(document.getElementById('fridayHours').value) || 0,
            saturday: parseFloat(document.getElementById('saturdayHours').value) || 0,
            sunday: parseFloat(document.getElementById('sundayHours').value) || 0
        };
        
        const weeklyHours = Object.values(dailyHours).reduce((sum, hours) => sum + hours, 0);
        const workDaysPerWeek = Object.values(dailyHours).filter(hours => hours > 0).length;
        
        if (weeklyHours <= 0) {
            document.getElementById('detailedWorkTimeResult').innerHTML = 
                '<span style="color: #ffcccb;">Please enter at least some work hours</span>';
            return;
        }
        
        // Calculate total hours needed
        const totalHoursNeeded = targetAmount / currentHourlyRate;
        
        // Calculate work periods needed (rounding up to full periods)
        const weeksNeeded = Math.ceil(totalHoursNeeded / weeklyHours);
        
        // Calculate days needed based on actual work days per week
        const totalWorkDaysNeeded = weeksNeeded * workDaysPerWeek;
        
        // Calculate months and years using averages but with practical rounding
        const monthsNeeded = weeksNeeded / 4.33;
        const yearsNeeded = weeksNeeded / WEEKS_PER_YEAR;
        
        // Calculate actual hours that will be worked (accounting for full periods)
        const actualHoursWorked = weeksNeeded * weeklyHours;
        const actualAmountEarned = actualHoursWorked * currentHourlyRate;
        
        document.getElementById('detailedWorkTimeResult').innerHTML = `
            <div class="highlight">To earn $${targetAmount.toFixed(2)}:</div>
            <div>You need to work ${weeksNeeded} full week(s)</div>
            <div>That's ${totalWorkDaysNeeded} work day(s) with your schedule</div>
            <div>Approximately ${monthsNeeded.toFixed(1)} months (average)</div>
            <div>Or about ${yearsNeeded.toFixed(2)} years (average)</div>
            <div style="margin-top: 10px; font-size: 0.9em; opacity: 0.9;">
                You'll actually earn approximately $${actualAmountEarned.toFixed(2)} working ${actualHoursWorked} hours
            </div>
            <div style="margin-top: 8px; font-size: 0.8em; opacity: 0.7; font-style: italic;">
                Note: Calculations use average time (4.33 weeks/month, 52 weeks/year)
            </div>
        `;
    }
    
    function updateTargetCalculationStatus() {
        const statusElement = document.getElementById('targetCalculationStatus');
        if (currentHourlyRate > 0) {
            statusElement.innerHTML = `Using approximate hourly rate: $${currentHourlyRate.toFixed(2)} | Hours/week: ${currentHoursPerWeek}`;
            statusElement.style.color = '#28a745';
        } else {
            statusElement.innerHTML = 'Hourly rate not calculated yet';
            statusElement.style.color = '#dc3545';
        }
    }
    
    function updateDetailedTargetCalculationStatus() {
        const statusElement = document.getElementById('detailedTargetCalculationStatus');
        if (currentHourlyRate > 0) {
            statusElement.innerHTML = `Using approximate hourly rate: $${currentHourlyRate.toFixed(2)}`;
            statusElement.style.color = '#28a745';
        } else {    
            statusElement.innerHTML = 'Hourly rate not calculated yet';
            statusElement.style.color = '#dc3545';
        }
    }
});