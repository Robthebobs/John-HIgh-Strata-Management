import React from 'react';
import ContactCard from '../components/ContactCard';
import person1 from '../assets/person1.png';
import person2 from '../assets/person2.png';
import person3 from '../assets/person3.png';
import person4 from '../assets/person4.png';
import person5 from '../assets/person5.png';
import person6 from '../assets/person6.png';

const Contact = () => {
  const contacts = [
    {
      image: person1,
      name: "Davis Wang",
      position: "Chairman",
      phone: "(02) 3456 7890",
      email: "davis.wang@johnhighstrata.com"
    },
    {
      image: person2,
      name: "Daniel Roberts",
      position: "Co-president",
      phone: "(02) 6789 1234",
      email: "daniel.roberts@johnhighstrata.com"
    },
    {
      image: person3,
      name: "Derik Das",
      position: "Secretary",
      phone: "(02) 2345 6789",
      email: "derik.das@johnhighstrata.com"
    },
    {
      image: person4,
      name: "Michael Carter",
      position: "Treasurer",
      phone: "(02) 8901 2345",
      email: "michael.carter@johnhighstrata.com"
    },
    {
      image: person5,
      name: "James Taylor",
      position: "Committee Member",
      phone: "(02) 4567 8901",
      email: "james.taylor@johnhighstrata.com"
    },
    {
      image: person6,
      name: "Kenji Tanaka",
      position: "Building Manager",
      phone: "(02) 5678 9012",
      email: "kenji.tanaka@johnhighstrata.com"
    }
  ];

  return (
    <main className="main-content">
      <div className="contact-page">
        <h1 className="page-title">Contact Details</h1>
        <div className="contact-grid">
          {contacts.map((contact, index) => (
            <ContactCard
              key={index}
              image={contact.image}
              name={contact.name}
              position={contact.position}
              phone={contact.phone}
              email={contact.email}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Contact; 