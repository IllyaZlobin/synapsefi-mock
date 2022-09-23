export class IVirtualDocument {
  document_value: string;

  document_type: string;

  meta: {
    country_code: string;
  };
}

export class ISocialDocument {
  document_value: string;

  document_type: string;

  meta: {
    address_street: string;
    address_city: string;
    address_subdivision: string;
    address_postal_code: string;
    address_country_code: string;
    address_care_of: string;
  };
}

export class IPhysicalDocument {
  document_value: string;

  document_type: string;

  id?: string | undefined;

  meta: {
    country_code: string;
  };
}

export class IDocument {
  id: string;

  email: string;

  phone_number: string;

  ip: string;

  name: string;

  ownership_percentage?: number;

  title?: string;

  entity_type: string;

  entity_scope: string;

  day: number;

  month: number;

  year: number;

  address_street: string;

  address_city: string;

  address_subdivision: string;

  address_postal_code: string;

  address_country_code: string;
}
