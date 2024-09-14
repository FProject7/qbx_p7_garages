import {
  MantineProvider,
  Center,
  Text,
  Accordion,
  Badge,
  ActionIcon,
  Group,
  TextInput,
  Button,
  Card,
  Progress,
  Avatar,
  Stack,
  SimpleGrid,
} from '@mantine/core';
import { IconSearch, IconMapPin, IconStar, IconStarFilled, IconCar } from '@tabler/icons-react';
import { useState } from 'react';
import { VisibilityProvider, useVisibility } from '../providers/VisibilityProvider';
import { theme } from '../theme';
import { fetchNui } from '../utils/fetchNui';

// Example function to send data to the Lua backend


interface Vehicle {
  vehicle: string; // Vehicle name
  plate: string;
  model: number;
  image: string;
  location: string;
  statistics: {
    engine: number;
    body: number;
    fuel: number;
  };
  isFavorite: boolean;
  isOut: boolean;
}

export default function AppComp() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  // Example vehicles for testing
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [search, setSearch] = useState('');
  const { visible } = useVisibility();

  const toggleFavorite = (vehicle: Vehicle) => {
    setVehicles((prevVehicles) =>
      prevVehicles.map((v) =>
        v.vehicle === vehicle.vehicle ? { ...v, isFavorite: !v.isFavorite } : v
      )
    );
    fetchNui('setFavourite', { plate: vehicle.plate, favorite: !vehicle.isFavorite })
          .then((response) => {
            console.log('Setting as favorite:', response);
          })
          .catch((error) => {
            console.error('Error setting as favorite:', error);
    });
    
  };
  
  

  const handleTakeOut = () => {
    if (selectedVehicle) {
      if (selectedVehicle.isOut) {
        console.log(`Finding vehicle with plate: ${selectedVehicle.plate}`);
        fetchNui('findVehicle', { plate: selectedVehicle.plate })
          .then((response) => {
            console.log('Vehicle found:', response);
          })
          .catch((error) => {
            console.error('Error finding vehicle:', error);
          });
      } else {
        console.log(`Spawning vehicle with plate: ${selectedVehicle.plate}`);
        fetchNui('spawnVehicle', { plate: selectedVehicle.plate })
          .then((response) => {
            console.log('Vehicle spawned:', response);
          })
          .catch((error) => {
            console.error('Error spawning vehicle:', error);
          });
      }

      setSelectedVehicle((prev) =>
        prev ? { ...prev, isOut: !prev.isOut } : null
      );
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(search.toLowerCase())
  );

  const sortedVehicles = filteredVehicles.sort((a, b) =>
    a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1
  );

  if (!visible) {
    return null;
  }

  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      <Center style={{ height: '100vh', flexDirection: 'column' }}>
        <Card
          shadow="md"
          style={{
            width: '600px',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #4a4a4a',
          }}
        >
          <Text fw={500} size="lg" mb="sm" style={{ textAlign: 'center' }}>
            Legion Square
          </Text>

          <TextInput
            placeholder="Search by name or plate"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            style={{
              width: '100%',
              marginBottom: '20px',
              borderRadius: '8px',
            }}
          />

          <Accordion
            variant="contained"
            chevron={null}
            multiple={false}
            styles={{
              item: {
                border: '1px solid #4a4a4a',
                padding: '10px',
              },
              control: {
                padding: '10px',
              },
            }}
          >
            {sortedVehicles.length > 0 ? (
              sortedVehicles.map((vehicle, index) => (
                <Accordion.Item key={index} value={vehicle.vehicle}>
                  <Accordion.Control>
                    <Group align="center" justify="space-between" style={{ flexWrap: 'nowrap' }}>
                      {/* Avatar and Vehicle name/plate */}
                      <Group align="center" gap="xs">
                        <Avatar src={vehicle.image} radius="xl" />
                        <Group gap={0}>
                          <SimpleGrid cols={1}>
                            <Text fw={500} size="sm">
                              {vehicle.vehicle}
                            </Text>
                            <Badge color="yellow" size="sm">
                              {vehicle.plate}
                            </Badge>
                          </SimpleGrid>
                        </Group>
                      </Group>

                      <Group gap="xs">
                        <Button
                          size="xs"
                          color="blue"
                          leftSection={<IconMapPin size={14} />}
                        >
                          {vehicle.location}
                        </Button>

                        <ActionIcon onClick={() => toggleFavorite(vehicle)}>
                          {vehicle.isFavorite ? (
                            <IconStarFilled size={18} color="yellow" />
                          ) : (
                            <IconStar size={18} />
                          )}
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Accordion.Control>

                  <Accordion.Panel>
                    <Stack gap="sm">
                      <Group style={{ justifyContent: 'space-between' }}>
                        <Text size="sm">Fuel</Text>
                        <Text size="sm">{vehicle.statistics.fuel}%</Text>
                      </Group>
                      <Progress value={vehicle.statistics.fuel} color="green" size="lg" radius="md" />

                      <Group style={{ justifyContent: 'space-between' }}>
                        <Text size="sm">Engine</Text>
                        <Text size="sm">{vehicle.statistics.engine}%</Text>
                      </Group>
                      <Progress value={vehicle.statistics.engine} color="red" size="lg" radius="md" />

                      <Group style={{ justifyContent: 'space-between' }}>
                        <Text size="sm">Body</Text>
                        <Text size="sm">{vehicle.statistics.body}%</Text>
                      </Group>
                      <Progress value={vehicle.statistics.body} color="orange" size="lg" radius="md" />
                    </Stack>

                    {vehicle.isOut ? (
                      <Text size="sm" color="red">
                        Vehicle is currently out of the garage.
                      </Text>
                    ) : (
                      <Button
                        mt="sm"
                        leftSection={<IconCar size={16} />}
                        onClick={() => handleTakeOut}
                      >
                        Take Out Vehicle
                      </Button>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              ))
            ) : (
              <Center>
                <Text>No vehicles found</Text>
              </Center>
            )}
          </Accordion>
        </Card>
      </Center>
    </MantineProvider>
  );
}
