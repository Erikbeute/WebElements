# WebElements
## Overview
This repository contains two main components: a calendar application and an event data overview system.
The calendar component is implemented in PHP, while the event data overview is implemented in HTML and JavaScript.

## Getting Started

Run the Applications:
For the calendar, navigate to localhost/path/to/php/calendar.
For the event data overview, navigate to localhost/path/to/HTML/event-data.

## Calendar

The calendar component provides a traditional calendar interface that accepts JSON input to populate event data. It allows users to navigate through months and view events on specific dates.

## Event Data Overview

The event data overview component provides a selector-based interface for filtering and displaying events. The selectors influence each other, making it easier to search and filter large sets of data.

### Features
Chained Selectors: The second and third selectors update based on the first selector's choice.
Dynamic Data Display: Events are dynamically displayed based on the selected filters.
JSON Input: Accepts JSON input for event data.

### Usage
JSON Input: Ensure your JSON data is structured correctly to populate the selectors and events.
Selectors: Use the selectors to filter events based on the criteria.

Example JSON Structure

{
    "categories": [
        {
            "name": "Category 1",
            "events": [
                {
                    "title": "Event 1",
                    "date": "2024-08-01",
                    "description": "Description for Event 1"
                },
                {
                    "title": "Event 2",
                    "date": "2024-08-05",
                    "description": "Description for Event 2"
                }
            ]
        },
        {
            "name": "Category 2",
            "events": [
                {
                    "title": "Event 3",
                    "date": "2024-08-10",
                    "description": "Description for Event 3"
                }
            ]
        }
    ]
}







