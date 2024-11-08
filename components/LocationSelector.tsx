"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import Fuse from "fuse.js";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllCities } from "@/lib/getLocations";

interface City {
  id: number;
  name: string;
}

interface Province {
  id: number;
  name: string;
  cities: City[];
}

interface LocationSelectorProps {
  onLocationSelect: (location: string) => void;
}

// Example data, replace with your actual data
const provincesData: Province[] = getAllCities();

export default function LocationSelector({
  onLocationSelect,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);

  useEffect(() => {
    setProvinces(provincesData);
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(provinces, {
        keys: ["name", "cities.name"],
        includeMatches: true,
        threshold: 0.3,
      }),
    [provinces]
  );

  const filteredResults = useMemo(() => {
    if (!search) return provinces;
    return fuse.search(search).map((result) => result.item);
  }, [fuse, search, provinces]);

  const handleProvinceSelect = (province: Province) => {
    const location = `همه شهرهای ${province.name}`;
    setValue(location);
    onLocationSelect(location);
    setOpen(false);
  };

  const handleCitySelect = (city: City, province: Province) => {
    const location = city.name;
    setValue(`${city.name}, ${province.name}`);
    onLocationSelect(location);
    setOpen(false);
  };

  const handleSearchSelect = (city: City, province: Province) => {
    const location = city.name;
    onLocationSelect(location);
    setValue(`${city.name}, ${province.name}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className='md:w-[250px]'>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            "h-14 justify-between w-full text-lg",
            value.includes("همه شهرهای") ? "text-base" : "text-lg"
          )}
        >
          <span className='truncate'>{value || "انتخاب شهر یا استان..."}</span>
          <ChevronsUpDown className='ml-2 h-5 w-5 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0 w-full md:w-[250px]'>
        <Command className='font-[family-name:var(--font-vazirmatn-regular)]'>
          <CommandInput
            placeholder='جستجو...'
            className='h-12 text-lg'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {search ? (
              filteredResults.length === 0 ? (
                <CommandEmpty>هیچ نتیجه‌ای یافت نشد.</CommandEmpty>
              ) : (
                filteredResults.flatMap((province) =>
                  province.cities
                    .filter((city) =>
                      city.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((city) => (
                      <CommandItem
                        key={city.id}
                        value={city.name}
                        onSelect={() => handleSearchSelect(city, province)}
                        className='text-lg'
                      >
                        <MapPin className='w-4 h-4' />
                        {city.name}, {province.name}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === `${city.name}, ${province.name}`
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))
                )
              )
            ) : (
              <Accordion type='single' collapsible className='w-full'>
                {provinces.map((province) => (
                  <AccordionItem
                    value={province.id.toString()}
                    key={province.id}
                  >
                    <AccordionTrigger className='text-lg font-bold text-red-800 px-2'>
                      {province.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <CommandGroup>
                        <CommandItem
                          value={`همه شهرهای ${province.name}`}
                          onSelect={() => handleProvinceSelect(province)}
                          className='text-lg font-bold'
                        >
                          {`همه شهرهای ${province.name}`}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === `همه شهرهای ${province.name}`
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                        {province.cities.map((city) => (
                          <CommandItem
                            key={city.id}
                            value={city.name}
                            onSelect={() => handleCitySelect(city, province)}
                            className='text-lg'
                          >
                            {city.name}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                value === `${city.name}, ${province.name}`
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
