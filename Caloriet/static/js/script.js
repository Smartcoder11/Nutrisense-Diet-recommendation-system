// script.js

// Chart.js library assumed to be included in the HTML (<head>) section

// Function to fetch micronutrient data from Firebase (optional)
function getMicronutrientDataFromFirebase() {
  // Replace with your Firebase configuration and data retrieval logic
  // This function should return an object or array containing micronutrient data
  // in a format compatible with Chart.js (labels and data arrays)
  const micronutrients = {
    labels: ['Protein', 'Fats', 'Carbs'],
    datasets: [{
      data: [0, 0, 0], // Placeholder values until data is fetched
      backgroundColor: [ // A vibrant color palette
      'rgba(295, 0, 11, 1)', // Orange
      'rgba(255, 204, 153, 1)', // Light orange
      'rgba(102, 179, 255, 1)' // Blue
    ],
    hoverBackgroundColor: [ // Brighter versions for hover
      'rgba(295, 0, 11, 0.7)',
      'rgba(255, 204, 153, 0.7)',
      'rgba(102, 179, 255, 0.7)'
    ]
    }]
  };
  return micronutrients;
}

// Micronutrient data (replace with Firebase data if using Firebase)
const micronutrients = {
  labels: ['Protein', 'Fats', 'Carbs'],
  datasets: [{
    data: [17.07, 15.53, 105.82], // Replace with your actual values
    backgroundColor: ['#ff9933', '#ffcc99', '#66b3ff'],
    hoverBackgroundColor: ['#ff7f0e', '#ffa581', '#538dbc']
  }]
};

// Chart creation using Chart.js
const pieChart = new Chart(document.getElementById('pie-chart'), {
  type: 'pie',
  data: micronutrients,
  options: {
    // Customize pie chart options (labels, tooltips, etc.) here
    title: {
      display: true,
      text: 'Micronutrient Breakdown (Pie Chart)'
    }
  }
});

const barChart = new Chart(document.getElementById('bar-chart'), {
  type: 'bar',
  data: micronutrients,
  options: {
    // Customize bar chart options (scales, labels, tooltips, etc.) here
    title: {
      display: true,
      text: 'Micronutrient Breakdown (Bar Chart)'
    },
    // scales: {
    //   xAxes: [{
    //     stacked: true // Enable stacking for bar chart
    //   }],
    //   yAxes: [{
    //     stacked: true // Enable stacking for bar chart
    //   }]
    // }
  }
});
