import { reset, seed } from "drizzle-seed";
import * as schema from "./schema";
import { db } from ".";

async function main() {
  const rolesArray = ["super_admin", "admin", "moderator", "support", "user"];
  const userTypesArray = ["job_seeker", "freelancer", "employer"];

  await reset(db, schema);
  console.log("DB reseted");
  await seed(db, schema).refine((funcs) => ({
    users: {
      count: 10,
      columns: {
        username: funcs.fullName(),
        email: funcs.email(),
        phone: funcs.phoneNumber({ template: "(###) ###-####" }),
        role: funcs.valuesFromArray({ values: rolesArray }),
        userType: funcs.valuesFromArray({ values: userTypesArray }),
        bio: funcs.loremIpsum(),
        location: funcs.city(),
        createdAt: funcs.date({ minDate: "2010-12-31", maxDate: "2024-08-26" }),
      },
    },
  }));

  console.log("DB Seeded");
}

main();

// import {
//   users,
//   jobs,
//   rolesTable,
//   userTypesTable,
//   workModesTable,
//   jobTypesTable,
//   compensationsTable,
//   experienceLevelsTable,
//   languageLevelsTable,
//   degreesTable,
//   communicationChannelsTable,
//   currenciesTable,
//   visibilityLevelsTable,
//   applicationStatusesTable,
//   notificationStatusesTable,
//   contractStatusesTable,
//   paymentStatusesTable,
//   jobIndustriesTable,
//   jobCategoriesTable,
//   freelancers,
//   employers,
//   skills,
//   userSkills,
//   experience,
//   education,
//   certifications,
//   projects,
//   userConnections,
//   reviews,
//   socialMediaLinks,
//   jobApplications,
//   contracts,
//   payments,
//   messages,
//   notifications,
//   userActivityLogs,
// } from "./schema";
// import { db } from ".";

// async funcstion truncateAllTables() {
//   const result = await db.execute(
//     ` SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'; `
//   );
//   const tableNames = result.rows.map((row) => row.table_name);
//   for (const tableName of tableNames) {
//     await db.execute(`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`);
//   }
// }

// async funcstion seed() {
//   await truncateAllTables();

//   await db
//     .insert(rolesTable)
//     .values([
//       { name: "super-admin" },
//       { name: "admin" },
//       { name: "moderator" },
//       { name: "support" },
//       { name: "user" },
//     ]);
//   await db
//     .insert(userTypesTable)
//     .values([
//       { name: "job-seeker" },
//       { name: "freelancer" },
//       { name: "employer" },
//     ]);
//   await db
//     .insert(workModesTable)
//     .values([{ name: "remote" }, { name: "onsite" }, { name: "hybrid" }]);
//   await db
//     .insert(jobTypesTable)
//     .values([
//       { name: "full-time" },
//       { name: "part-time" },
//       { name: "contract" },
//       { name: "freelance" },
//       { name: "internship" },
//       { name: "temporary" },
//     ]);
//   await db
//     .insert(compensationsTable)
//     .values([
//       { name: "hourly" },
//       { name: "salary" },
//       { name: "commission" },
//       { name: "bonuses" },
//       { name: "equity" },
//       { name: "benefits" },
//     ]);
//   await db
//     .insert(experienceLevelsTable)
//     .values([
//       { name: "entry" },
//       { name: "junior" },
//       { name: "mid" },
//       { name: "senior" },
//       { name: "lead" },
//       { name: "executive" },
//     ]);
//   await db
//     .insert(languageLevelsTable)
//     .values([
//       { name: "basic" },
//       { name: "conversational" },
//       { name: "fluent" },
//       { name: "native" },
//     ]);
//   await db
//     .insert(degreesTable)
//     .values([
//       { name: "High School" },
//       { name: "Associate" },
//       { name: "Bachelor's" },
//       { name: "Master's" },
//       { name: "PhD" },
//       { name: "Diploma" },
//       { name: "Certificate" },
//     ]);
//   await db
//     .insert(communicationChannelsTable)
//     .values([
//       { name: "email" },
//       { name: "phone-call" },
//       { name: "video-call" },
//       { name: "SMS" },
//       { name: "messaging-app" },
//       { name: "twitter" },
//     ]);
//   await db
//     .insert(currenciesTable)
//     .values([
//       { name: "USD" },
//       { name: "EUR" },
//       { name: "IRR" },
//       { name: "CAD" },
//     ]);
//   await db
//     .insert(visibilityLevelsTable)
//     .values([
//       { name: "public" },
//       { name: "private" },
//       { name: "restricted" },
//       { name: "connections" },
//     ]);
//   await db
//     .insert(notificationStatusesTable)
//     .values([{ name: "unread" }, { name: "read" }, { name: "archived" }]);
//   await db
//     .insert(contractStatusesTable)
//     .values([
//       { name: "draft" },
//       { name: "active" },
//       { name: "completed" },
//       { name: "terminated" },
//     ]);
//   await db
//     .insert(paymentStatusesTable)
//     .values([{ name: "pending" }, { name: "completed" }, { name: "failed" }]);
//   await db
//     .insert(jobIndustriesTable)
//     .values([
//       { name: "aerospace-and-defense" },
//       { name: "agriculture-and-farming" },
//       { name: "automotive" },
//       { name: "biotechnology" },
//       { name: "chemicals-and-materials" },
//       { name: "construction-and-real-estate" },
//       { name: "consumer-goods" },
//       { name: "education-and-training" },
//       { name: "energy-and-utilities" },
//       { name: "environmental-services" },
//       { name: "finance-and-banking" },
//       { name: "food-and-beverage" },
//       { name: "government-and-public-sector" },
//       { name: "healthcare-and-medical" },
//       { name: "hospitality-and-tourism" },
//       { name: "information-technology" },
//       { name: "insurance" },
//       { name: "legal-services" },
//       { name: "logistics-and-transportation" },
//       { name: "manufacturing-and-engineering" },
//       { name: "media-and-entertainment" },
//       { name: "mining-and-metals" },
//       { name: "nonprofit-and-social-services" },
//       { name: "pharmaceuticals" },
//       { name: "professional-services" },
//       { name: "retail-and-ecommerce" },
//       { name: "sports-and-recreation" },
//       { name: "telecommunications" },
//       { name: "textiles-and-apparel" },
//       { name: "waste-management" },
//     ]);

//   await db.insert(jobCategoriesTable).values([
//     // Aerospace and Defense
//     { name: "aerospace_engineering" },
//     { name: "avionics" },
//     { name: "defense_technology" },
//     { name: "aircraft_maintenance" },
//     { name: "space_systems" },

//     // Agriculture and Farming
//     { name: "crop_management" },
//     { name: "livestock_management" },
//     { name: "agricultural_engineering" },
//     { name: "food_science" },
//     { name: "precision_agriculture" },

//     // Automotive
//     { name: "automotive_engineering" },
//     { name: "vehicle_design" },
//     { name: "automotive_manufacturing" },
//     { name: "auto_mechanics" },
//     { name: "electric_vehicle_technology" },

//     // Biotechnology
//     { name: "genetic_engineering" },
//     { name: "bioinformatics" },
//     { name: "biomedical_engineering" },
//     { name: "biochemistry" },
//     { name: "molecular_biology" },

//     // Chemicals and Materials
//     { name: "chemical_engineering" },
//     { name: "materials_science" },
//     { name: "polymer_chemistry" },
//     { name: "nanotechnology" },
//     { name: "petrochemicals" },

//     // Construction and Real Estate
//     { name: "architecture" },
//     { name: "civil_engineering" },
//     { name: "project_management" },
//     { name: "carpentry" },
//     { name: "plumbing" },
//     { name: "electrician" },
//     { name: "real_estate_sales" },
//     { name: "property_management" },
//     { name: "urban_planning" },
//     { name: "surveying" },

//     // Consumer Goods
//     { name: "product_development" },
//     { name: "brand_management" },
//     { name: "packaging_design" },
//     { name: "consumer_research" },
//     { name: "quality_assurance" },

//     // Education and Training
//     { name: "teaching" },
//     { name: "tutoring" },
//     { name: "curriculum_development" },
//     { name: "educational_technology" },
//     { name: "research" },
//     { name: "academic_administration" },
//     { name: "online_instruction" },
//     { name: "special_education" },
//     { name: "early_childhood_education" },
//     { name: "adult_education" },

//     // Energy and Utilities
//     { name: "renewable_energy" },
//     { name: "power_systems_engineering" },
//     { name: "energy_efficiency" },
//     { name: "utility_management" },
//     { name: "oil_and_gas_operations" },

//     // Environmental Services
//     { name: "environmental_science" },
//     { name: "conservation" },
//     { name: "sustainability_consulting" },
//     { name: "waste_management" },
//     { name: "environmental_policy" },

//     // Finance and Banking
//     { name: "accounting" },
//     { name: "investment_banking" },
//     { name: "financial_analysis" },
//     { name: "auditing" },
//     { name: "risk_management" },
//     { name: "corporate_finance" },
//     { name: "taxation" },
//     { name: "financial_advising" },
//     { name: "wealth_management" },
//     { name: "fintech" },

//     // Food and Beverage
//     { name: "culinary_arts" },
//     { name: "beverage_production" },
//     { name: "nutrition" },
//     { name: "restaurant_management" },

//     // Government and Public Sector
//     { name: "public_administration" },
//     { name: "policy_analysis" },
//     { name: "diplomacy" },
//     { name: "public_safety" },

//     // Healthcare and Medical
//     { name: "nursing" },
//     { name: "physician" },
//     { name: "pharmacy" },
//     { name: "medical_lab_technician" },
//     { name: "physical_therapy" },
//     { name: "mental_health" },
//     { name: "radiology" },
//     { name: "dental" },
//     { name: "public_health" },
//     { name: "healthcare_administration" },

//     // Hospitality and Tourism
//     { name: "hotel_management" },
//     { name: "food_service" },
//     { name: "event_planning" },
//     { name: "tour_guiding" },
//     { name: "travel_agent" },
//     { name: "housekeeping" },
//     { name: "recreational_services" },

//     // Information Technology
//     { name: "software_development" },
//     { name: "web_development" },
//     { name: "mobile_app_development" },
//     { name: "data_science" },
//     { name: "machine_learning" },
//     { name: "cybersecurity" },
//     { name: "cloud_computing" },
//     { name: "it_support" },
//     { name: "ui_ux_design" },
//     { name: "game_development" },

//     // Insurance
//     { name: "actuarial_science" },
//     { name: "underwriting" },
//     { name: "claims_management" },
//     { name: "insurance_sales" },
//     { name: "risk_assessment" },

//     // Legal Services
//     { name: "lawyer" },
//     { name: "paralegal" },
//     { name: "legal_assistant" },
//     { name: "corporate_law" },
//     { name: "criminal_law" },
//     { name: "intellectual_property" },
//     { name: "family_law" },
//     { name: "litigation" },
//     { name: "contract_law" },

//     // Logistics and Transportation
//     { name: "logistics_management" },
//     { name: "supply_chain_optimization" },
//     { name: "freight_handling" },
//     { name: "truck_driving" },
//     { name: "warehouse_management" },
//     { name: "aviation" },
//     { name: "maritime" },
//     { name: "public_transportation" },

//     // Manufacturing and Engineering
//     { name: "mechanical_engineering" },
//     { name: "electrical_engineering" },
//     { name: "industrial_engineering" },
//     { name: "production_supervision" },
//     { name: "supply_chain" },
//     { name: "product_design" },
//     { name: "process_engineering" },

//     // Media and Entertainment
//     { name: "journalism" },
//     { name: "content_creation" },
//     { name: "video_production" },
//     { name: "graphic_design" },
//     { name: "animation" },
//     { name: "sound_engineering" },
//     { name: "acting" },
//     { name: "music_production" },
//     { name: "event_management" },
//     { name: "broadcasting" },

//     // Mining and Metals
//     { name: "geology" },
//     { name: "mining_engineering" },
//     { name: "metallurgy" },
//     { name: "mineral_processing" },
//     { name: "environmental_management" },

//     // Nonprofit and Social Services
//     { name: "social_work" },
//     { name: "fundraising" },
//     { name: "volunteer_management" },
//     { name: "community_outreach" },
//     { name: "program_coordination" },

//     // Pharmaceuticals
//     { name: "pharmaceutical_research" },
//     { name: "drug_development" },
//     { name: "clinical_trials" },
//     { name: "regulatory_affairs" },
//     { name: "pharmacology" },

//     // Professional Services
//     { name: "management_consulting" },
//     { name: "human_resources" },
//     { name: "marketing" },
//     { name: "public_relations" },
//     { name: "business_analysis" },

//     // Retail and E-commerce
//     { name: "sales" },
//     { name: "customer_service" },
//     { name: "inventory_management" },
//     { name: "digital_marketing" },
//     { name: "store_management" },
//     { name: "ecommerce_operations" },
//     { name: "supply_chain_management" },
//     { name: "merchandising" },

//     // Sports and Recreation
//     { name: "sports_coaching" },
//     { name: "fitness_instruction" },
//     { name: "sports_management" },
//     { name: "recreation_planning" },
//     { name: "athletic_training" },

//     // Telecommunications
//     { name: "network_engineering" },
//     { name: "telecommunications_technology" },
//     { name: "wireless_communications" },
//     { name: "fiber_optics" },
//     { name: "telecom_project_management" },

//     // Textiles and Apparel
//     { name: "fashion_design" },
//     { name: "textile_engineering" },
//     { name: "garment_production" },
//     { name: "quality_control" },
//     { name: "fashion_merchandising" },

//     // Waste Management
//     { name: "waste_treatment" },
//     { name: "recycling_operations" },
//     { name: "environmental_engineering" },
//     { name: "hazardous_materials_management" },
//     { name: "sustainability_planning" },
//   ]);

//   // Seed users
//   await db.insert(users).values([
//     {
//       username: "john_doe",
//       userTypeId: 1,
//       email: "john@example.com",
//       phone: "1234567890",
//       password: "hashed_password",
//       roleId: 2,
//       isActive: true,
//     },
//     {
//       username: "jane_smith",
//       userTypeId: 1,
//       email: "jane@example.com",
//       phone: "0987654321",
//       password: "hashed_password",
//       roleId: 3,
//       isActive: true,
//     },
//   ]);

//   const userRows = await db.select().from(users);
//   const userIds = userRows.map((row) => row.id);

//   // Seed freelancers
//   await db.insert(freelancers).values([
//     {
//       userId: userIds[0],
//       resume: "John's resume",
//       hourlyRate: 50,
//       visibilityId: 1,
//     },
//   ]);

//   // Seed employers
//   await db.insert(employers).values([
//     {
//       userId: userIds[1],
//       companyName: "Tech Corp",
//       description: "Leading tech company",
//       industry: "Technology",
//       size: "100-500",
//       visibilityId: 1,
//     },
//   ]);

//   // Seed jobs
//   await db.insert(jobs).values([
//     {
//       employerId: userIds[1],
//       title: "Senior Developer",
//       description: "We're looking for a senior developer",
//       jobTypeId: 1,
//       workModeId: 1,
//       jobIndustryId: 1,
//       jobCategoryId: 1,
//       currencyId: 1,
//       salaryMin: 80000,
//       salaryMax: 120000,
//       isActive: true,
//     },
//   ]);

//   await db
//     .insert(skills)
//     .values([
//       { name: "JavaScript" },
//       { name: "Python" },
//       { name: "React" },
//       { name: "Node.js" },
//       { name: "SQL" },
//     ]);

//   const skillRows = await db.select().from(skills);
//   const skillIds = skillRows.map((row) => row.id);

//   // Seed user skills
//   await db.insert(userSkills).values([
//     { userId: userIds[0], skillId: skillIds[0] },
//     { userId: userIds[0], skillId: skillIds[2] },
//     { userId: userIds[1], skillId: skillIds[1] },
//     { userId: userIds[1], skillId: skillIds[3] },
//   ]);

//   // Seed experience
//   await db.insert(experience).values([
//     {
//       userId: userIds[0],
//       jobTitle: "Senior Developer",
//       company: "Tech Solutions Inc.",
//       startDate: new Date("2018-01-01"),
//       endDate: new Date("2021-12-31"),
//       responsibilities: JSON.stringify([
//         "Lead development team",
//         "Implement new features",
//       ]),
//       achievements: JSON.stringify([
//         "Increased team productivity by 30%",
//         "Launched 5 major projects",
//       ]),
//       description:
//         "Worked on various web development projects using modern technologies.",
//     },
//   ]);

//   // Seed education
//   await db.insert(education).values([
//     {
//       userId: userIds[0],
//       institution: "Tech University",
//       degreeId: 3, // Assuming 3 is the id for Bachelor's degree
//       fieldOfStudy: "Computer Science",
//       startDate: new Date("2014-09-01"),
//       endDate: new Date("2018-05-31"),
//       description:
//         "Studied various aspects of computer science and software engineering.",
//     },
//   ]);

//   // Seed certifications
//   await db.insert(certifications).values([
//     {
//       userId: userIds[0],
//       name: "AWS Certified Developer",
//       authority: "Amazon Web Services",
//       issueDate: new Date("2020-06-15"),
//       expirationDate: new Date("2023-06-15"),
//     },
//   ]);

//   // Seed projects
//   await db.insert(projects).values([
//     {
//       userId: userIds[0],
//       title: "E-commerce Platform",
//       description:
//         "Developed a full-stack e-commerce platform using React and Node.js",
//       link: "https://github.com/johndoe/ecommerce-platform",
//     },
//   ]);

//   // Seed user connections
//   await db
//     .insert(userConnections)
//     .values([{ userId: userIds[0], connectionId: userIds[1] }]);

//   // Seed reviews
//   await db.insert(reviews).values([
//     {
//       reviewerId: userIds[1],
//       revieweeId: userIds[0],
//       rating: 5,
//       comment: "Excellent developer, highly recommended!",
//     },
//   ]);

//   // Seed social media links
//   await db.insert(socialMediaLinks).values([
//     {
//       employerId: userIds[1],
//       link: "https://www.linkedin.com/company/tech-corp",
//     },
//   ]);

//   // Seed job applications
//   await db
//     .insert(applicationStatusesTable)
//     .values([
//       { name: "applied" },
//       { name: "initial accept" },
//       { name: "interview" },
//       { name: "accepted" },
//       { name: "rejected" },
//     ]);

//   await db.insert(jobApplications).values([
//     {
//       userId: userIds[0],
//       jobId: 1, // Assuming 1 is the id of the job we created earlier
//       statusId: 1, // Assuming 1 is the id for "applied" status
//       coverLetter: "I am excited to apply for this position...",
//     },
//   ]);

//   // Seed contracts
//   await db.insert(contracts).values([
//     {
//       jobId: 1,
//       freelancerId: userIds[0],
//       employerId: userIds[1],
//       statusId: 1, // Assuming 1 is the id for "active" status
//       startDate: new Date(),
//       endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
//       paymentTerms: "Payment due upon completion of milestones",
//     },
//   ]);

//   // Seed payments
//   await db.insert(payments).values([
//     {
//       contractId: 1,
//       amount: 5000,
//       currencyId: 1, // Assuming 1 is the id for USD
//       statusId: 1, // Assuming 1 is the id for "completed" status
//       paymentDate: new Date(),
//     },
//   ]);

//   // Seed messages
//   await db.insert(messages).values([
//     {
//       senderId: userIds[0],
//       receiverId: userIds[1],
//       content: "Hello, I'm interested in discussing the job opportunity.",
//       isRead: false,
//     },
//   ]);

//   // Seed notifications
//   await db.insert(notifications).values([
//     {
//       userId: userIds[1],
//       message: "You have a new job application for Senior Developer position.",
//       statusId: 1, // Assuming 1 is the id for "unread" status
//     },
//   ]);

//   // Seed user activity logs
//   await db.insert(userActivityLogs).values([
//     {
//       userId: userIds[0],
//       activityType: "applied_for_job",
//     },
//     {
//       userId: userIds[1],
//       activityType: "posted_job",
//     },
//   ]);

//   console.log("Seeding completed");
// }

// async funcstion main() {
//   try {
//     await seed();
//     console.log("Database seeded successfully");
//   } catch (error) {
//     console.error("Error during seeding:", error);
//     process.exit(1);
//   }
// }

// main();
