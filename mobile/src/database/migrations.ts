import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 3,
      steps: [
        addColumns({
          table: 'ponds',
          columns: [
            { name: 'district_code', type: 'string', isOptional: true },
            { name: 'block_code', type: 'string', isOptional: true },
            { name: 'panchayat_code', type: 'string', isOptional: true },
            { name: 'district_name', type: 'string', isOptional: true },
            { name: 'block_name', type: 'string', isOptional: true },
            { name: 'panchayat_name', type: 'string', isOptional: true },
          ],
        }),
      ],
    },
  ],
});
