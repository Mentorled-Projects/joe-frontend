

import { Tutor } from "@/types/Tutor"; 


const mockTutors: Tutor[] = [
  {
    _id: "tutor1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@example.com",
    phoneNumber: "111-222-3333",
    location: "New York, USA",
    avatar: "https://placehold.co/160x160/E0E0E0/666666?text=SJ",
    banner: "https://placehold.co/800x200/C7D4FF/2F5FFF?text=Tutor+Banner",
    hourlyRate: { min: 35, max: 45 },
    rating: 4.9,
    reviewsCount: 150,
    subjects: [
      { name: "Mathematics", level: "All levels" },
      { name: "Physics", level: "High School" },
    ],
    certifications: ["Licensed Mathematics Teacher", "STEM Educator Certified"],
    about: "I'm a passionate mathematics educator with over 7 years of experience teaching students from middle school through college level. I specialize in making complex mathematical concepts accessible and engaging for all learning styles. My teaching approach focuses on building strong foundational understanding rather than just memorizing formulas. I believe every student can excel in mathematics with the right guidance and practice. I hold a Master's degree in Mathematics Education from Boston University and have experience teaching in both public schools and private tutoring settings.",
    availability: [
      { day: "Monday - Friday", startTime: "4:00 PM", endTime: "8:00 PM" },
      { day: "Saturday", startTime: "10:00 AM", endTime: "2:00 PM" },
    ],
  },
  {
    _id: "tutor2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.c@example.com",
    phoneNumber: "444-555-6666",
    location: "Los Angeles, USA",
    avatar: "https://placehold.co/160x160/E0E0E0/666666?text=MC",
    banner: "https://placehold.co/800x200/C7D4FF/2F5FFF?text=Tutor+Banner",
    hourlyRate: { min: 40, max: 50 },
    rating: 4.7,
    reviewsCount: 120,
    subjects: [{ name: "Physics", level: "College" }],
    certifications: ["PhD in Physics"],
    about: "Physics and Chemistry expert with a passion for making science fun and understandable. I have extensive experience in both classroom and one-on-one settings.",
    availability: [
      { day: "Tuesday - Thursday", startTime: "5:00 PM", endTime: "9:00 PM" },
      { day: "Sunday", startTime: "11:00 AM", endTime: "3:00 PM" },
    ],
  },
  {
    _id: "tutor3",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.r@example.com",
    phoneNumber: "777-888-9999",
    location: "Chicago, USA",
    avatar: "https://placehold.co/160x160/E0E0E0/666666?text=ER",
    banner: "https://placehold.co/800x200/C7D4FF/2F5FFF?text=Tutor+Banner",
    hourlyRate: { min: 30, max: 40 },
    rating: 4.8,
    reviewsCount: 95,
    subjects: [{ name: "English Literature", level: "All levels" }],
    certifications: ["M.Ed. English Education"],
    about: "Passionate English tutor dedicated to fostering a love for reading and writing. I help students improve their comprehension, analytical skills, and essay writing.",
    availability: [
      { day: "Monday - Wednesday", startTime: "3:00 PM", endTime: "7:00 PM" },
    ],
  },
  {
    _id: "tutor4",
    firstName: "James",
    lastName: "Wilson",
    email: "james.w@example.com",
    phoneNumber: "123-456-7890",
    location: "Houston, USA",
    avatar: "https://placehold.co/160x160/E0E0E0/666666?text=JW",
    banner: "https://placehold.co/800x200/C7D4FF/2F5FFF?text=Tutor+Banner",
    hourlyRate: { min: 35, max: 45 },
    rating: 4.8,
    reviewsCount: 110,
    subjects: [{ name: "History", level: "Social Studies" }],
    certifications: ["History Degree"],
    about: "History and Social Studies teacher with a knack for making past events come alive. I encourage critical thinking and a deep understanding of historical contexts.",
    availability: [
      { day: "Tuesday - Friday", startTime: "4:00 PM", endTime: "8:00 PM" },
    ],
  },
  {
    _id: "tutor5",
    firstName: "Olivia",
    lastName: "Park",
    email: "olivia.p@example.com",
    phoneNumber: "987-654-3210",
    location: "San Francisco, USA",
    avatar: "https://placehold.co/160x160/E0E0E0/666666?text=OP",
    banner: "https://placehold.co/800x200/C7D4FF/2F5FFF?text=Tutor+Banner",
    hourlyRate: { min: 45, max: 60 },
    rating: 5.0,
    reviewsCount: 200,
    subjects: [{ name: "Computer Science", level: "Coding" }],
    certifications: ["Computer Science Degree"],
    about: "Coding and CS enthusiast with a focus on practical application and problem-solving. I teach students from beginner to advanced levels in various programming languages.",
    availability: [
      { day: "Monday - Thursday", startTime: "6:00 PM", endTime: "10:00 PM" },
    ],
  },
  {
    _id: "tutor6",
    firstName: "Daniel",
    lastName: "Thompson",
    email: "daniel.t@example.com",
    phoneNumber: "555-123-4567",
    location: "Miami, USA",
    avatar: "https://placehold.co/160x160/E0E0E0/666666?text=DT",
    banner: "https://placehold.co/800x200/C7D4FF/2F5FFF?text=Tutor+Banner",
    hourlyRate: { min: 40, max: 55 },
    rating: 4.9,
    reviewsCount: 180,
    subjects: [{ name: "Music Theory", level: "Piano" }],
    certifications: ["Music Conservatory Graduate"],
    about: "Music and Piano instructor with a deep understanding of music theory and performance. I help students develop their musicality and technical skills.",
    availability: [
      { day: "Wednesday - Saturday", startTime: "2:00 PM", endTime: "7:00 PM" },
    ],
  },
  {
    _id: "tutor7",
    firstName: "Sofia",
    lastName: "Martinez",
    email: "sofia.m@example.com",
    phoneNumber: "222-333-4444",
    location: "Phoenix, USA",
    avatar: "https://placehold.co/160x160/E0E0E0/666666?text=SM",
    banner: "https://placehold.co/800x200/C7D4FF/2F5FFF?text=Tutor+Banner",
    hourlyRate: { min: 30, max: 45 },
    rating: 4.8,
    reviewsCount: 105,
    subjects: [{ name: "Spanish", level: "French" }],
    certifications: ["Language Teaching Certificate"],
    about: "Fluent in Spanish and French, I make language learning an immersive and enjoyable experience. My goal is to help students communicate confidently.",
    availability: [
      { day: "Monday - Friday", startTime: "9:00 AM", endTime: "1:00 PM" },
    ],
  },
  {
    _id: "tutor8",
    firstName: "Ryan",
    lastName: "Anderson",
    email: "ryan.a@example.com",
    phoneNumber: "888-999-0000",
    location: "Dallas, USA",
    avatar: "https://placehold.co/160x160/E0E0E0/666666?text=RA",
    banner: "https://placehold.co/800x200/C7D4FF/2F5FFF?text=Tutor+Banner",
    hourlyRate: { min: 35, max: 50 },
    rating: 4.7,
    reviewsCount: 90,
    subjects: [{ name: "Art", level: "Design" }],
    certifications: ["Fine Arts Degree"],
    about: "Creative Art and Design teacher inspiring students to explore their artistic potential. I cover various mediums and techniques.",
    availability: [
      { day: "Saturday - Sunday", startTime: "10:00 AM", endTime: "4:00 PM" },
    ],
  },
];

const mockTutorApi = {
  getTutorById: async (id: string): Promise<Tutor | undefined> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockTutors.find((tutor) => tutor._id === id);
  },
  getSimilarTutors: async (currentTutorId: string): Promise<Tutor[]> => {
    // Simulate fetching similar tutors (excluding the current one)
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockTutors.filter(tutor => tutor._id !== currentTutorId).slice(0, 4); // Return up to 4 similar tutors
  }
};

export default mockTutorApi;
