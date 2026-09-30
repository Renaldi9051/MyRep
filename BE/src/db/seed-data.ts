import type { Exercise } from './schema.js';

// Latihan bawaan (PRD F1.1). ID tetap supaya seed aman diulang dan sama di semua lingkungan.
// Jangan ubah ID yang sudah ada; set di perangkat pengguna merujuk ID ini.
// movement_key diisi untuk latihan yang punya animasi panduan gerakan di FE.
export const builtInExercises: (Pick<Exercise, 'id' | 'name' | 'type' | 'muscle_group'> & {
  movement_key?: string;
})[] = [
  // dada
  { id: 'c7e09c23-e3bf-4d90-9c9c-7a368d709f1b', name: 'Bench Press', type: 'beban', muscle_group: 'dada', movement_key: 'bench-press' },
  { id: 'd073e1a7-0e17-4c2c-98cb-3c31f5b55dff', name: 'Incline Bench Press', type: 'beban', muscle_group: 'dada' },
  { id: '7c49dd2e-fd0a-4eac-9cea-4b929de15c7b', name: 'Decline Bench Press', type: 'beban', muscle_group: 'dada' },
  { id: '3c4acde3-6d77-4067-9074-a56935fc527e', name: 'Dumbbell Bench Press', type: 'beban', muscle_group: 'dada' },
  { id: '0411f487-f2ae-4e9b-8a2f-194a769769db', name: 'Incline Dumbbell Press', type: 'beban', muscle_group: 'dada' },
  { id: '0e309088-c9b8-4bd8-894c-c55825afecab', name: 'Dumbbell Fly', type: 'beban', muscle_group: 'dada' },
  { id: '8ff3f61a-4f99-4454-a318-2f4864adbcc9', name: 'Cable Crossover', type: 'beban', muscle_group: 'dada' },
  { id: 'fbd75a08-3095-4800-95ee-7bfba58823a1', name: 'Pec Deck', type: 'beban', muscle_group: 'dada', movement_key: 'chest-fly' },
  { id: '02edf5a1-3d71-4457-8fa4-5c6e4f49ad95', name: 'Chest Press Machine', type: 'beban', muscle_group: 'dada' },
  { id: '256f72ee-2b71-40e2-8a8c-ea6ebd20083d', name: 'Push Up', type: 'beban', muscle_group: 'dada' },
  { id: 'a685c118-7a87-4db1-a28c-8eda49d3bcf2', name: 'Chest Dip', type: 'beban', muscle_group: 'dada' },
  // punggung
  { id: '48bc3f05-4918-4fbe-98b9-94d0de3d1708', name: 'Deadlift', type: 'beban', muscle_group: 'punggung' },
  { id: 'f7548d23-622a-4287-838c-a7c38cb8e40e', name: 'Pull Up', type: 'beban', muscle_group: 'punggung' },
  { id: 'be346a16-2457-49f4-82f1-0d7b6c153dbe', name: 'Chin Up', type: 'beban', muscle_group: 'punggung' },
  { id: 'f19697fe-fd97-4f3c-a8fa-1807a854538b', name: 'Lat Pulldown', type: 'beban', muscle_group: 'punggung', movement_key: 'lat-pulldown' },
  { id: '3d8d2290-64b1-4047-a7cc-8127a8b009a6', name: 'Barbell Row', type: 'beban', muscle_group: 'punggung' },
  { id: 'c2784e2c-f679-40a7-a2a2-4422fc764131', name: 'Dumbbell Row', type: 'beban', muscle_group: 'punggung' },
  { id: 'd847a3bc-216f-4225-8162-deb3decacc18', name: 'Seated Cable Row', type: 'beban', muscle_group: 'punggung', movement_key: 'seated-cable-row' },
  { id: '5a453b1c-95f1-4eb2-902e-b6c8b61fc34a', name: 'T-Bar Row', type: 'beban', muscle_group: 'punggung' },
  { id: '8460d57d-a51b-4eaf-94ed-e814b27ee8d4', name: 'Back Extension', type: 'beban', muscle_group: 'punggung' },
  // kaki
  { id: '10826841-a1c7-4e87-b171-83f800c83c60', name: 'Squat', type: 'beban', muscle_group: 'kaki', movement_key: 'squat' },
  { id: 'f7828ebf-e58a-4462-ab89-b5d01759e4ff', name: 'Front Squat', type: 'beban', muscle_group: 'kaki' },
  { id: '3c30156e-17b2-463b-9b8f-362447d1da73', name: 'Leg Press', type: 'beban', muscle_group: 'kaki' },
  { id: '2efcf596-304e-4727-802a-9871f9fba25a', name: 'Romanian Deadlift', type: 'beban', muscle_group: 'kaki' },
  { id: 'a8d38952-17bb-4a72-b699-797d1d6ad103', name: 'Lunge', type: 'beban', muscle_group: 'kaki' },
  { id: '13a1a297-2915-4893-8cb1-df46359cd3fb', name: 'Bulgarian Split Squat', type: 'beban', muscle_group: 'kaki' },
  { id: 'b647cdb0-1ea6-4381-84f1-04e4ba5570fc', name: 'Leg Extension', type: 'beban', muscle_group: 'kaki' },
  { id: '5ad43b01-1796-4b25-b665-94b1a1dbb6df', name: 'Leg Curl', type: 'beban', muscle_group: 'kaki' },
  { id: 'd3182bc1-776a-41c9-8f88-13576b4c7a35', name: 'Hip Thrust', type: 'beban', muscle_group: 'kaki' },
  { id: '0208b934-ee48-472a-ab05-7d5e6d888eac', name: 'Calf Raise', type: 'beban', muscle_group: 'kaki' },
  // bahu
  { id: 'f9df3573-e60f-44a0-b29f-da5b498bef1d', name: 'Overhead Press', type: 'beban', muscle_group: 'bahu' },
  { id: '543ac950-364b-4935-81d3-44fcdf733079', name: 'Dumbbell Shoulder Press', type: 'beban', muscle_group: 'bahu' },
  { id: '981a7e4b-5de9-455f-b7ba-4e24d92566f8', name: 'Lateral Raise', type: 'beban', muscle_group: 'bahu' },
  { id: '2cf502a0-6118-489f-880d-851e98025c86', name: 'Front Raise', type: 'beban', muscle_group: 'bahu' },
  { id: '7ed34744-ec65-4b99-988d-b8c72ab121c9', name: 'Rear Delt Fly', type: 'beban', muscle_group: 'bahu' },
  { id: '600aa0f2-ff2f-4a09-96cb-c0358a1b17c7', name: 'Face Pull', type: 'beban', muscle_group: 'bahu' },
  { id: 'f6cb02c2-5b08-4712-aece-33f2446ab26f', name: 'Shrug', type: 'beban', muscle_group: 'bahu' },
  // lengan
  { id: '6ca47c82-d023-4f7e-9660-c4d4fd472318', name: 'Barbell Curl', type: 'beban', muscle_group: 'lengan' },
  { id: '04656ec3-6f41-47e7-8eae-7e9f72eddeea', name: 'Dumbbell Curl', type: 'beban', muscle_group: 'lengan' },
  { id: '24e3502b-f9db-4d77-9350-6ad47597fe51', name: 'Hammer Curl', type: 'beban', muscle_group: 'lengan' },
  { id: 'e675c68f-e649-4ca4-9fde-cefd9e134d31', name: 'Preacher Curl', type: 'beban', muscle_group: 'lengan' },
  { id: 'e266ce06-59d6-4d37-a5a0-ea7fa77d066e', name: 'Tricep Pushdown', type: 'beban', muscle_group: 'lengan' },
  { id: '1ab367f7-fd58-4604-bd25-bc3a306c7732', name: 'Skull Crusher', type: 'beban', muscle_group: 'lengan' },
  { id: '05d69ff0-7cf7-41b8-8de2-90413059b3cd', name: 'Overhead Tricep Extension', type: 'beban', muscle_group: 'lengan' },
  { id: '2383716d-dee3-46b1-b37c-1d49c0ea3c91', name: 'Close Grip Bench Press', type: 'beban', muscle_group: 'lengan' },
  // perut
  { id: 'e9f90ec5-98b6-4b80-9eb6-f91048433c74', name: 'Crunch', type: 'beban', muscle_group: 'perut' },
  { id: '104394c3-3a09-4997-b5f2-da5de56b1415', name: 'Sit Up', type: 'beban', muscle_group: 'perut' },
  { id: 'e66d35f8-36ba-4231-b4c5-58c85785907b', name: 'Hanging Leg Raise', type: 'beban', muscle_group: 'perut' },
  { id: '6047854f-b85b-4dc3-909d-e21a5cd7a71d', name: 'Cable Crunch', type: 'beban', muscle_group: 'perut' },
  { id: '52c9d8c4-5a90-4ad2-a41a-622e06164da9', name: 'Russian Twist', type: 'beban', muscle_group: 'perut' },
  { id: '77064264-89fa-4b32-87f6-6cc7b17278e0', name: 'Ab Wheel Rollout', type: 'beban', muscle_group: 'perut' },
  // kardio
  { id: '0ebfbff5-9759-4de8-a2e6-195e7710aa50', name: 'Treadmill', type: 'kardio', muscle_group: 'kardio' },
  { id: '72b06bc7-b35c-4bd8-96a3-d03d93b81186', name: 'Sepeda Statis', type: 'kardio', muscle_group: 'kardio' },
  { id: '88a8c870-fda1-4523-b64f-b9b16d7137f8', name: 'Elliptical', type: 'kardio', muscle_group: 'kardio' },
  { id: '7ac76d8e-0b55-42f4-be2e-73d439d0e03f', name: 'Rowing Machine', type: 'kardio', muscle_group: 'kardio' },
  { id: '9a812b11-51fa-4838-8d53-cbdaf224a719', name: 'Stair Climber', type: 'kardio', muscle_group: 'kardio' },
];
