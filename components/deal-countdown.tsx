'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Date cible statique (remplacez par la date souhaitée)
const TARGET_DATE = new Date('2025-03-31T00:00:00');

// Fonction pour calculer le temps restant
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    jours: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    heures: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    secondes: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>(); 

  useEffect(() => {
    // Calculer le temps restant initial sur le client
    setTime(calculateTimeRemaining(TARGET_DATE));

    const timerInterval = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
      setTime(newTime);

      // Arrêter lorsque le compte à rebours est terminé
      if (
        newTime.jours === 0 &&
        newTime.heures === 0 &&
        newTime.minutes === 0 &&
        newTime.secondes === 0
      ) {
        clearInterval(timerInterval);
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Afficher un état de chargement pendant l'hydratation
  if (!time) {
    return (
      <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
        <div className='flex flex-col gap-2 justify-center'>
          <h3 className='text-3xl font-bold'>Chargement du compte à rebours...</h3>
        </div>
      </section>
    );
  }

  // Si le compte à rebours est terminé, afficher une UI alternative
  if (
    time.jours === 0 &&
    time.heures === 0 &&
    time.minutes === 0 &&
    time.secondes === 0
  ) {
    return (
      <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
        <div className='flex flex-col gap-2 justify-center'>
          <h3 className='text-3xl font-bold'>Offre terminée</h3>
          <p>Cette offre n'est plus disponible. Découvrez nos dernières promotions !</p>
          <div className='text-center'>
            <Button asChild>
              <Link href='/search'>Voir les produits</Link>
            </Button>
          </div>
        </div>
        <div className='flex justify-center'>
          <Image
            src='/images/promo.jpg'
            alt='promotion'
            width={300}
            height={200}
          />
        </div>
      </section>
    );
  }

  return (
    <section className='grid grid-cols-1 md:grid-cols-2 my-20'>
      <div className='flex flex-col gap-2 justify-center'>
        <h3 className='text-3xl font-bold'>Offre du mois</h3>
        <p>
          Profitez d'une expérience de shopping unique avec nos Offres du Mois ! 
          Chaque achat vous offre des avantages exclusifs et des promotions spéciales. 
          Ne manquez pas cette opportunité ! 
        </p>
        <ul className='grid grid-cols-4'>
          <StatBox label='Jours' value={time.jours} />
          <StatBox label='Heures' value={time.heures} />
          <StatBox label='Minutes' value={time.minutes} />
          <StatBox label='Secondes' value={time.secondes} />
        </ul>
        <div className='text-center'>
          <Button asChild>
            <Link href='/search'>Voir les produits</Link>
          </Button>
        </div>
      </div>
      <div className='flex justify-center'>
        <Image
          src='/images/promo.jpg'
          alt='promotion'
          width={300}
          height={200}
        />
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <li className='p-4 w-full text-center'>
    <p className='text-3xl font-bold'>{value}</p>
    <p>{label}</p>
  </li>
);

export default DealCountdown;
