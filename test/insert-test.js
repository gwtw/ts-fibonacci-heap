import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/insert-tests';

testHelper.run(test, FibonacciHeap);
