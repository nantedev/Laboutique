import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
  } from '@react-email/components';
  import { formatCurrency } from '@/lib/utils';
  import { Order } from '@/types';
  import sampleData from '@/db/sample-data';
  require('dotenv').config();
  
  type OrderInformationProps = {
    order: Order;
  };
  
  const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
  
  export default function PurchaseReceiptEmail({ order }: {order: Order}) {
    return (
      <Html>
        <Preview>Voir le reçu de commande</Preview>
        <Tailwind>
          <Head />
          <Body className='font-sans bg-white'>
            <Container className='max-w-xl'>
              <Heading>Reçu d'achat</Heading>
              <Section>
                <Row>
                  <Column>
                    <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>
                      ID de commande
                    </Text>
                    <Text className='mt-0 mr-4'>{order.id.toString()}</Text>
                  </Column>
                  <Column>
                    <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>
                      Acheté le
                    </Text>
                    <Text className='mt-0 mr-4'>
                      {dateFormatter.format(order.createdAt)}
                    </Text>
                  </Column>
                  <Column>
                    <Text className='mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4'>
                      Prix payé
                    </Text>
                    <Text className='mt-0 mr-4'>
                      {formatCurrency(order.totalPrice)}
                    </Text>
                  </Column>
                </Row>
              </Section>
              <Section className='border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4'>
                {order.orderitems.map((item) => (
                  <Row key={item.productId} className='mt-8'>
                    <Column className='w-20'>
                      <Img
                        width='80'
                        alt={item.name}
                        className='rounded'
                        src={
                          item.image.startsWith('/')
                            ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                            : item.image
                        }
                      />
                    </Column>
                    <Column className='align-top'>
                      <Text className='mx-2 my-0'>
                        {item.name} x {item.qty}
                      </Text>
                    </Column>
                    <Column align='right' className='align-top'>
                      <Text className='m-0 '>{formatCurrency(item.price)}</Text>
                    </Column>
                  </Row>
                ))}
                {[
                  { name: 'Articles', price: order.itemsPrice },
                  { name: 'Taxe', price: order.taxPrice },
                  { name: 'Livraison', price: order.shippingPrice },
                  { name: 'Total', price: order.totalPrice },
                ].map(({ name, price }) => (
                  <Row key={name} className='py-1'>
                    <Column align='right'>{name} :</Column>
                    <Column align='right' width={70} className='align-top'>
                      <Text className='m-0'>{formatCurrency(price)}</Text>
                    </Column>
                  </Row>
                ))}
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
}

