'use client'

import { APP_NAME } from '@/lib/constants';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className='border-t'>
      <div className='p-5 flex-center'>
        {currentYear} {APP_NAME} par nantedev.
      </div>
    </footer>
  );
};

export default Footer;