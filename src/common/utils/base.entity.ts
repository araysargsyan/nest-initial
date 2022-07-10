import { PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { TBaseEntityFields } from '@/common/types';

export abstract class BaseEntity implements Record<TBaseEntityFields, any> {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
