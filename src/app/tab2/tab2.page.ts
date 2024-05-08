import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Event {
  title: string;
  description: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {

  currentMonth: string = '';
  currentYear: number = 0;
  currentDate: number = 0;
  days: number[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  date: Date = new Date();
  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  events: { [day: number]: Event[] } = {};
  isEventDetailsOpen: boolean = false;
  eventDetails: Event[] = [];

  newEvent: Event = {
    title: '', // Initialize with an empty string
    description: ''
  };
  editedEvent: { title: string; description: string; };
  editMode: boolean;

  constructor(private alertController: AlertController) {
    this.getDaysOfMonth();
  }

  getDaysOfMonth() {
    const firstDayOfMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    const daysInMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();

    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentDate = this.date.getDate();

    this.days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(i);
    }

    // Add days from the previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate() - i;
      this.days.unshift(prevMonthDate);
    }

    // Add days from the next month
    const lastDayOfMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    for (let i = 1; i <= 6 - lastDayOfMonth; i++) {
      this.days.push(i);
    }
  }

  daysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  goToLastMonth() {
    const newMonth = this.date.getMonth() - 1;
    if (newMonth < 0) {
      this.date = new Date(this.date.getFullYear() - 1, 11, this.date.getDate());
    } else {
      this.date = new Date(this.date.getFullYear(), newMonth, this.date.getDate());
    }
    this.resetEvents();
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    const newMonth = this.date.getMonth() + 1;
    if (newMonth > 11) {
      this.date = new Date(this.date.getFullYear() + 1, 0, this.date.getDate());
    } else {
      this.date = new Date(this.date.getFullYear(), newMonth, this.date.getDate());
    }
    this.resetEvents();
    this.getDaysOfMonth();
  }

  resetEvents() {
    this.events = {}; // Reset the events object
  }

  selectDate(day: number) {
    this.currentDate = day;
  }

  isOtherMonth(day: number): boolean {
    const currentMonth = this.date.getMonth();
    const currentYear = this.date.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    return day < 1 || day > daysInMonth;
  }

  showEventDetails(day: number) {
    this.eventDetails = this.events[day] || [];
    this.isEventDetailsOpen = true;
  }

  async addEvent() {
    // Validate event details
    if (!this.newEvent.title.trim()) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Please enter the Event title.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Add the new event to the events object
    if (!this.events[this.currentDate]) {
      this.events[this.currentDate] = [];
    }
    this.events[this.currentDate].push(this.newEvent);

    // Clear the form
    this.newEvent = {
      title: '', // Initialize with an empty string
      description: ''
    };

    // Close the input form (optional)
    // You can add logic to close the form or keep it open based on your design
  }

  deleteEvent(index: number) {
    this.eventDetails.splice(index, 1);
  }

  toggleEditMode(event: Event) {
    this.editedEvent = { ...event }; // Create a copy of the event being edited
    this.editMode = true;

  }

  // cancelEdit() {
  //   this.editMode = false;
  //   this.editedEvent = null;
  // }

  updateEvent() {
    // Find the index of the edited event in the eventDetails array
    const index = this.eventDetails.findIndex(event => event === this.editedEvent);
    if (index !== -1) {
      // Update the event at the found index
      this.eventDetails[index] = { ...this.editedEvent }; // Copy the edited event
    }

    // this.cancelEdit(); // Exit edit mode
  }

  loadEventDetails(event: Event) {
    this.newEvent = { ...event }; // Copy event details to the input fields
    this.isEventDetailsOpen = false;
    const index = this.eventDetails.findIndex(event => event === this.editedEvent);
    this.deleteEvent(index);
  }
  

}
