<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendar</title>
    <link rel="stylesheet" href="../css/calendar.css"> 
</head>
<body>
    <div id="calendar-container">
        <div class="calendar">
            <header>
                <label id="calendar-title" for="calendar-date"></label>
                <input id="calendar-date" type="date">
                <div class="spacer"></div>
                <button class="headerButton"><i class="fas fa-chevron-left"></i></button>
                <button class="headerButton" id="today-button">Today</button>
                <button class="headerButton"><i class="fas fa-chevron-right"></i></button>
            </header>

            <div id="legenda">
    <ul class="icon-list-items">
        <li class="icon-list-item">
            <div class="legenda-item">
                <i aria-hidden="true" class="fas fa-square" id="EventsGlobalSolutions"></i>
                <span class="elementor-icon-list-text" style="margin-left: 8px;">Events Global Solutions</span>
            </div>
        </li>
        <li class="icon-list-item">
            <div class="legenda-item">
                <i aria-hidden="true" class="fas fa-square" id="EventsPrime"></i>
                <span class="elementor-icon-list-text" style="margin-left: 8px;">Events Prime</span>
            </div>
        </li>
        <li class="icon-list-item">
            <div class="legenda-item">
                <i aria-hidden="true" class="fas fa-square" id="EventsInnovate"></i>
                <span class="elementor-icon-list-text" style="margin-left: 8px;">Events Innovate</span>
            </div>
        </li>
        <li class="icon-list-item">
            <div class="legenda-item">
                <i aria-hidden="true" class="fas fa-square" id="EventsAlpha"></i>
                <span class="elementor-icon-list-text" style="margin-left: 8px;">Events Alpha</span>
            </div>
        </li>
        <li class="icon-list-item">
            <div class="legenda-item">
                <i aria-hidden="true" class="fas fa-square" id="EventsHorizon"></i>
                <span class="elementor-icon-list-text" style="margin-left: 8px;">Events Horizon</span>
            </div>
        </li>
    </ul>
</div>

            <ol class="day-names">
                <li>Sun</li>
                <li>Mon</li>
                <li>Tue</li>
                <li>Wed</li>
                <li>Thu</li>
                <li>Fri</li>
                <li>Sat</li>
            </ol>
            <ol class="days">
                <?php for ($i = 0; $i < 42; $i++): ?>
                    <li>
                        <div class="content"></div>
                    </li>
                <?php endfor; ?>
            </ol>
        </div>
    </div>

    <div id="detailPopup" style="display: none;"></div>
    <script src="../js/calendar.js"></script> 
    <script src="../js/load-events.js"></script> 
</body>
</html>
