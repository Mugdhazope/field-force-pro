import React from 'react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  priority?: number; // Lower number = higher priority for mobile display
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-muted-foreground"
      >
        {emptyMessage}
      </motion.div>
    );
  }

  // Mobile: Card view
  if (isMobile) {
    // Get top priority columns for mobile (max 4)
    const mobileColumns = columns
      .filter((col) => !col.hideOnMobile)
      .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
      .slice(0, 4);

    return (
      <motion.div
        className={cn('space-y-3', className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {data.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <Card
              className={cn(
                'transition-all duration-200',
                onRowClick && 'cursor-pointer hover:shadow-md hover:border-primary/30 active:scale-[0.98]'
              )}
              onClick={() => onRowClick?.(item)}
            >
              <CardContent className="p-4 space-y-2">
                {mobileColumns.map((column, idx) => (
                  <div key={column.key} className={cn(
                    'flex justify-between items-center',
                    idx === 0 && 'pb-2 border-b'
                  )}>
                    <span className="text-sm text-muted-foreground">{column.header}</span>
                    <span className={cn('text-sm font-medium', idx === 0 && 'text-base')}>
                      {column.render
                        ? column.render(item)
                        : (item as any)[column.key]}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Desktop: Table view
  return (
    <motion.div
      className={cn('rounded-lg border bg-card overflow-hidden', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              className={cn(
                'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.render
                    ? column.render(item)
                    : (item as any)[column.key]}
                </TableCell>
              ))}
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
