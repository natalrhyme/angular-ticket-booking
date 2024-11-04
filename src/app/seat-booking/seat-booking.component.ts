import { Component } from '@angular/core';

@Component({
  selector: 'app-seat-booking',
  templateUrl: './seat-booking.component.html',
  styleUrls: ['./seat-booking.component.css']
})
export class SeatBookingComponent {
  coach: number[][] = Array.from({ length: 12 }, (_, i) =>
    i < 11 ? Array(7).fill(0) : Array(3).fill(0) // 11 rows of 7 seats, last row of 3 seats
  );

  // Display seat layout
  displaySeats(): string[][] {
    return this.coach.map(row => row.map(seat => (seat === 1 ? 'Booked' : 'Available')));
  }

  // Method to find contiguous seats in a single row
  findContiguousSeats(row: number[], seatsNeeded: number): [number, number] | null {
    let count = 0;
    let start = -1;
    for (let i = 0; i < row.length; i++) {
      if (row[i] === 0) {
        if (count === 0) start = i;
        count++;
        if (count === seatsNeeded) return [start, start + seatsNeeded - 1];
      } else {
        count = 0;
        start = -1;
      }
    }
    return null;
  }

  // Book seats method
  bookSeats(seatsNeeded: number) {
    if (seatsNeeded < 1 || seatsNeeded > 7) {
      alert('You can only book between 1 and 7 seats at a time.');
      return;
    }

    for (let i = 0; i < this.coach.length; i++) {
      const result = this.findContiguousSeats(this.coach[i], seatsNeeded);
      if (result) {
        const [start, end] = result;
        for (let j = start; j <= end; j++) this.coach[i][j] = 1;
        alert(`Seats booked in row ${i + 1}: ${Array.from({ length: end - start + 1 }, (_, k) => start + k + 1).join(', ')}`);
        return;
      }
    }

    // Book nearby seats if contiguous seats in a single row are not available
    let seatsBooked: [number, number][] = [];
    for (let i = 0; i < this.coach.length && seatsNeeded > 0; i++) {
      for (let j = 0; j < this.coach[i].length && seatsNeeded > 0; j++) {
        if (this.coach[i][j] === 0) {
          this.coach[i][j] = 1;
          seatsBooked.push([i + 1, j + 1]);
          seatsNeeded--;
        }
      }
    }
    alert(`Seats booked: ${seatsBooked.map(([r, s]) => `Row ${r} Seat ${s}`).join(', ')}`);
  }
}
