// Store the calculated hourly rate and hours per week
let currentHourlyRate = 0;
let currentHoursPerWeek = 40;
const WEEKS_PER_YEAR = 52; // Standard average
const MONTHS_PER_YEAR = 12; // Standard average

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hours per week value
    const hoursPerWeekInput = document.getElementById('hoursPerWeek');
    currentHoursPerWeek = parseFloat(hoursPerWeekInput.value) || 40;
    
    // Calculate hourly rate
    document.getElementById('calculateHourlyRate').addEventListener('click', calculateHourlyRate);
    
    // Auto-calculate work time when target amount changes
    document.getElementById('targetAmount').addEventListener('input', calculateWorkTime);
    
    // Auto-calculate hourly rate when any input changes in the first section
    document.getElementById('salaryAmount').addEventListener('input', autoCalculateHourlyRate);
    document.getElementById('hoursPerWeek').addEventListener('input', function() {
        currentHoursPerWeek = parseFloat(this.value) || 40;
        autoCalculateHourlyRate();
    });
    document.getElementById('salaryPeriod').addEventListener('change', autoCalculateHourlyRate);
    
    function autoCalculateHourlyRate() {
        const salaryAmount = parseFloat(document.getElementById('salaryAmount').value);
        
        // Only auto-calculate if all required fields have values
        if (!isNaN(salaryAmount) && salaryAmount > 0) {
            calculateHourlyRate();
        }
    }
    
    function calculateHourlyRate() {
        const salaryPeriod = document.getElementById('salaryPeriod').value;
        const salaryAmount = parseFloat(document.getElementById('salaryAmount').value);
        const hoursPerWeek = parseFloat(document.getElementById('hoursPerWeek').value);
        
        if (isNaN(salaryAmount) || isNaN(hoursPerWeek)) {
            document.getElementById('hourlyRateResult').innerHTML = 
                '<span style="color: #ffcccb;">Please enter valid numbers</span>';
            currentHourlyRate = 0;
            updateTargetCalculationStatus();
            return;
        }
        
        if (salaryAmount <= 0 || hoursPerWeek <= 0) {
            document.getElementById('hourlyRateResult').innerHTML = 
                '<span style="color: #ffcccb;">Values must be greater than 0</span>';
            currentHourlyRate = 0;
            updateTargetCalculationStatus();
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
        
        // Update the status in the second section
        updateTargetCalculationStatus();
        
        // If there's a target amount, recalculate work time
        const targetAmount = parseFloat(document.getElementById('targetAmount').value);
        if (!isNaN(targetAmount) && targetAmount > 0) {
            calculateWorkTime();
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
        
        // Calculate months (assuming 4.33 weeks per month on average)
        const monthsNeeded = weeksNeeded / 4.33;
        
        // Calculate years (assuming 52 weeks per year)
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
});