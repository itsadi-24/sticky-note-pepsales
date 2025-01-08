import { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';

function App() {
  const [note, setNote] = useState('');

  useEffect(() => {
    const noteRef = ref(db, 'note');
    const unsubscribe = onValue(
      noteRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setNote(data.content || '');
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleNoteChange = (e) => {
    const newContent = e.target.value;
    setNote(newContent);

    set(ref(db, 'note'), {
      content: newContent,
      timestamp: Date.now(),
    }).catch((error) => {
      console.error('Error saving to Firebase:', error);
    });
  };

  return (
    <div className='flex items-start justify-center min-h-screen p-8 bg-gray-50'>
      <div className='w-full max-w-2xl p-6 text-center bg-white rounded-lg shadow-lg'>
        <h1 className='mb-4 text-2xl font-bold text-center'>My Sticky Note</h1>
        <textarea
          className='w-full min-h-[300px] p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-200'
          value={note}
          onChange={handleNoteChange}
          placeholder='Type your note here...'
        />
        <h3>
          Made by{' '}
          <a
            href='https://www.adiprasan.me/'
            target='_blank'
            rel='noopener noreferrer'
            className=' hover:underline hover:text-blue-500'
          >
            Adi Prasan Khuntia
          </a>
        </h3>
      </div>
    </div>
  );
}

export default App;
