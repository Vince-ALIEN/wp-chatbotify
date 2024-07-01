import React, { useState, useEffect } from 'react';
import { render } from '@wordpress/element';
import ChatBot from "react-chatbotify";

const App = () => {
  const [form, setForm] = useState({});
  const [isFormComplete, setIsFormComplete] = useState(false);

  const formStyle = {
    marginTop: 10,
    marginLeft: 20,
    border: "1px solid #491d8d",
    padding: 10,
    borderRadius: 5,
    maxWidth: 300,
  };

  const sendFormData = async (formData) => {
    if (!formData || Object.keys(formData).length === 0) {
      console.error('No form data to send');
      return;
    }

    try {
      const response = await fetch(wpuiSamplePlugin.ajaxurl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'wsp_send_form_data',
          form_data: JSON.stringify(formData),
          nonce: wpuiSamplePlugin.nonce
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        console.log('Form data sent successfully');
      } else {
        console.error('Failed to send form data:', data.data);
      }
    } catch (error) {
      console.error('Error sending form data:', error);
    }
  };

  useEffect(() => {
    if (isFormComplete) {
      sendFormData(form);
    }
  }, [isFormComplete, form]);

  const updateForm = (key, value) => {
    console.log(`Updating form: ${key} = ${value}`);
    setForm(prevForm => {
      const newForm = { ...prevForm, [key]: value };
      console.log('Updated form:', newForm);
      return newForm;
    });
  };

  const flow = {
    start: {
      message: "Hello there! What is your first name?",
      function: ({ userInput }) => {
        console.log('Start step:', userInput);
        updateForm('firstName', userInput);
      },
      path: "ask_last_name",
    },
    ask_last_name: {
      message: ({ userInput }) => `Nice to meet you ${userInput || ''}! What is your last name?`,
      function: ({ userInput }) => {
        console.log('Ask last name step:', userInput);
        updateForm('lastName', userInput);
      },
      path: "ask_email",
    },
    ask_email: {
      message: "Great! Now, what's your email address?",
      function: ({ userInput }) => {
        console.log('Ask email step:', userInput);
        updateForm('email', userInput);
      },
      path: "ask_age",
    },
    ask_age: {
      message: "And how old are you?",
      function: ({ userInput }) => {
        console.log('Ask age step:', userInput);
        updateForm('age', userInput);
      },
      path: "ask_pet",
    },
    ask_pet: {
      message: "Do you own any pets?",
      options: ["Yes", "None"],
      function: ({ userInput }) => {
        console.log('Ask pet step:', userInput);
        updateForm('pet_ownership', userInput);
      },
      path: "ask_choice",
    },
    ask_choice: {
      message: "Select at least 2 pets that you are comfortable to work with:",
      checkboxes: {
        items: ["Dog", "Cat", "Rabbit", "Hamster"],
        min: 2
      },
      function: ({ userInput }) => {
        console.log('Ask choice step:', userInput);
        updateForm('pet_choices', Array.isArray(userInput) ? userInput : [userInput]);
      },
      path: "ask_work_days",
    },
    ask_work_days: {
      message: "How many days can you work per week?",
      function: ({ userInput }) => {
        console.log('Ask work days step:', userInput);
        updateForm('num_work_days', userInput);
        setIsFormComplete(true);
      },
      path: "end",
    },
    end: {
      message: "Thank you for your interest, we will get back to you shortly!",
      render: () => (
        <div style={formStyle}>
          <p>First Name: {form.firstName || 'N/A'}</p>
          <p>Last Name: {form.lastName || 'N/A'}</p>
          <p>Email: {form.email || 'N/A'}</p>
          <p>Age: {form.age || 'N/A'}</p>
          <p>Pet Ownership: {form.pet_ownership || 'N/A'}</p>
          <p>Pet Choices: {form.pet_choices ? form.pet_choices.join(', ') : 'N/A'}</p>
          <p>Num Work Days: {form.num_work_days || 'N/A'}</p>
        </div>
      ),
      options: ["New Application"],
      function: () => {
        console.log('End step: Starting new application');
        setIsFormComplete(false);
        setForm({});
      },
      path: "start",
    },
  };

  const chatbotOptions = {
    theme: { embedded: true },
    chatHistory: { storageKey: "example_basic_form" },
  };

  return <ChatBot options={chatbotOptions} flow={flow} />;
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('wpui-sample-plugin');
  if (container) {
    render(<App />, container);
  }
});

export default App;