import test from 'ava';
import { FibonacciHeap } from '../';
import testHelper from '@tyriar/heap-tests/delete-tests';

testHelper.run(test, FibonacciHeap);
